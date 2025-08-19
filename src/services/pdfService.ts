import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MetricasReais } from './metricsService';
import { Material, Obra, Ensaio, RFI, Checklist, Documento, Fornecedor, NaoConformidade } from '@/types';
import type { Armadura } from '@/types/armaduras';
import { Certificado } from '@/types/certificados';
import { Norma } from '@/types/normas';
import { SubmissaoMaterial } from '@/types/submissaoMateriais';
import { Sinalizacao, InspecaoSinalizacao } from '@/types/sinalizacao';
import { SistemaSeguranca, InspecaoSeguranca } from '@/types/segurancaFerroviaria';
import { PonteTunel, InspecaoPontesTuneis } from '@/types/pontesTuneis';
import { PIEInstancia, PIESecao, PIEPonto, PIEResposta } from './pieService';

interface PIEReportData {
  pie: PIEInstancia;
  secoes: (PIESecao & { pontos: (PIEPonto & { resposta?: PIEResposta })[] })[];
  estatisticas: {
    totalPontos: number;
    pontosPreenchidos: number;
    pontosConformes: number;
    pontosNaoConformes: number;
    pontosNA: number;
    percentagemConclusao: number;
  };
  filters?: {
    status: string;
    prioridade: string;
    responsavel: string;
    zona: string;
    dataInicio: string;
    dataFim: string;
  };
  // Informações de assinatura e responsáveis
  assinaturas?: {
    qualidade?: {
      nome: string;
      cargo: string;
      data: string;
      assinatura?: string; // URL da imagem da assinatura
    };
    chefeObra?: {
      nome: string;
      cargo: string;
      data: string;
      assinatura?: string;
    };
  };
  // Responsáveis por tipo de inspeção
  responsaveis?: {
    betonagem?: string;
    geometria?: string;
    ensaios?: string;
    acabamentos?: string;
    estrutural?: string;
  };
  // Datas importantes
  datas?: {
    inicio: string;
    fim?: string;
    aprovacao?: string;
  };
}

interface RelatorioPDFOptions {
  titulo: string;
  subtitulo?: string;
  periodo: string;
  metricas: MetricasReais;
  tipo: string;
  filtros?: any;
}

interface RelatorioMateriaisOptions {
  titulo: string;
  subtitulo?: string;
  materiais: Material[];
  tipo: "executivo" | "individual" | "filtrado" | "comparativo";
  filtros?: any;
  materialEspecifico?: Material;
  mostrarCusto?: boolean;
  colunas?: Record<string, boolean>;
}

interface RelatorioObrasOptions {
  titulo: string;
  subtitulo?: string;
  obras: Obra[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioEnsaiosOptions {
  titulo: string;
  subtitulo?: string;
  ensaios: Ensaio[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioSolosOptions {
  titulo: string;
  subtitulo?: string;
  solos: any[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioRFIsOptions {
  titulo: string;
  subtitulo?: string;
  rfis: RFI[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioArmadurasOptions {
  titulo: string;
  subtitulo?: string;
  armaduras: Armadura[];
  tipo: "executivo" | "individual" | "filtrado" | "comparativo";
  filtros?: any;
  armaduraEspecifica?: Armadura;
  mostrarCusto?: boolean;
  colunas?: Record<string, boolean>;
}

interface RelatorioChecklistsOptions {
  titulo: string;
  subtitulo?: string;
  checklists: Checklist[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioDocumentosOptions {
  titulo: string;
  subtitulo?: string;
  documentos: Documento[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioFornecedoresOptions {
  titulo: string;
  subtitulo?: string;
  fornecedores: Fornecedor[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioNaoConformidadesOptions {
  titulo: string;
  subtitulo?: string;
  naoConformidades: NaoConformidade[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioCertificadosOptions {
  titulo: string;
  subtitulo?: string;
  certificados: any[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
  certificadoIndividual?: any;
}

interface RelatorioNormasOptions {
  titulo: string;
  subtitulo?: string;
  normas: any[];
  tipo: "executivo" | "individual" | "filtrado" | "comparativo";
  filtros?: any;
  normaEspecifica?: any;
  colunas?: Record<string, boolean>;
}

interface RelatorioSubmissaoMateriaisOptions {
  titulo: string;
  subtitulo?: string;
  submissoes: SubmissaoMaterial[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioSinalizacaoOptions {
  titulo: string;
  subtitulo?: string;
  sinalizacoes: Sinalizacao[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioInspecaoSinalizacaoOptions {
  titulo: string;
  subtitulo?: string;
  inspecoes: InspecaoSinalizacao[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioSegurancaFerroviariaOptions {
  titulo: string;
  subtitulo?: string;
  sistemas: SistemaSeguranca[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioPontesTuneisOptions {
  titulo: string;
  subtitulo?: string;
  pontesTuneis: any[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioInspecaoPontesTuneisOptions {
  titulo: string;
  subtitulo?: string;
  inspecoes: any[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

interface RelatorioInspecaoSegurancaOptions {
  titulo: string;
  subtitulo?: string;
  inspecoes: InspecaoSeguranca[];
  tipo: "executivo" | "filtrado" | "comparativo" | "individual";
  filtros?: any;
}

class PDFService {
  private doc: jsPDF;
  private pageNumber: number = 1;
  private totalPages: number = 1;

  constructor() {
    this.doc = new jsPDF();
  }

  private addProfessionalHeader(titulo: string, subtitulo?: string) {
    // Configuração da empresa
    const empresa = {
      nome: "ASCH Infraestructuras y Servicios SA",
      morada: "Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa",
      email: "info@aschinfraestructuras.com",
      telefone: "+351 123 456 789"
    };

    // Cabeçalho com fundo azul
    this.doc.setFillColor(30, 64, 175); // Azul escuro
    this.doc.rect(0, 0, this.doc.internal.pageSize.width, 40, 'F');
    
    // Logo/Texto da empresa (branco)
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Qualicore', 20, 20);
    
    // Informações da empresa
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(empresa.nome, 20, 28);
    this.doc.text(`${empresa.morada} | Tel: ${empresa.telefone} | Email: ${empresa.email}`, 20, 32);
    
    // Título do relatório (preto)
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(titulo, 20, 55);
    
    if (subtitulo) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99); // Cinza
      this.doc.text(subtitulo, 20, 65);
    }

    // Data de geração
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128); // Cinza claro
    this.doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 20, 75);
    
    // Linha separadora
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 80, this.doc.internal.pageSize.width - 20, 80);
  }

  private addProfessionalFooter() {
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;
    
    // Linha separadora
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
    
    // Informações do rodapé
    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    this.doc.setFont('helvetica', 'normal');
    
    // Lado esquerdo - Informações da empresa
    this.doc.text('Qualicore - Sistema de Gestão de Qualidade', 20, pageHeight - 20);
    this.doc.text('ASCH Infraestructuras y Servicios SA', 20, pageHeight - 15);
    
    // Centro - Data
    this.doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, pageWidth/2 - 15, pageHeight - 20);
    
    // Lado direito - Numeração de páginas
    this.doc.text(`Página ${this.pageNumber} de ${this.totalPages}`, pageWidth - 50, pageHeight - 20);
    this.doc.text('Documento confidencial', pageWidth - 60, pageHeight - 15);
  }

  private addKPICard(x: number, y: number, titulo: string, valor: string, cor: number[]) {
    try {
      const cardWidth = 40;
      const cardHeight = 20;
      
      // Fundo do card com cor
      this.doc.setFillColor(cor[0], cor[1], cor[2]);
      this.doc.rect(x, y, cardWidth, cardHeight, 'F');
      
      // Borda
      this.doc.setDrawColor(200, 200, 200);
      this.doc.rect(x, y, cardWidth, cardHeight);
      
      // Valor (branco)
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(valor, x + cardWidth/2, y + 10, { align: 'center' });
      
      // Título (branco)
      this.doc.setFontSize(6);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(titulo, x + cardWidth/2, y + 16, { align: 'center' });
    } catch (error) {
      console.error('Erro ao adicionar KPI card:', error);
      // Fallback simples
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${titulo}: ${valor}`, x, y + 10);
    }
  }

  private getStatusColor(estado: string): number[] {
    const colors: Record<string, number[]> = {
      'aprovado': [34, 197, 94], // Verde
      'pendente': [251, 146, 60], // Laranja
      'em_analise': [99, 102, 241], // Roxo
      'reprovado': [239, 68, 68], // Vermelho
      'concluido': [107, 114, 128], // Cinza
    };
    return colors[estado] || [107, 114, 128]; // Cinza padrão
  }

  private addStatusCard(x: number, y: number, estado: string, cor: number[]) {
    const cardWidth = 35;
    const cardHeight = 15;
    
    // Fundo do card com cor
    this.doc.setFillColor(cor[0], cor[1], cor[2]);
    this.doc.rect(x, y, cardWidth, cardHeight, 'F');
    
    // Borda
    this.doc.setDrawColor(200, 200, 200);
    this.doc.rect(x, y, cardWidth, cardHeight);
    
    // Texto do status (branco)
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    const statusText = estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ');
    this.doc.text(statusText, x + cardWidth/2, y + 10, { align: 'center' });
  }

  private addMetricasGerais(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Métricas Gerais', 20, 85);

    // Cards de KPI
    this.addKPICard(20, 95, 'Conformidade', `${metricas.geral.conformidade_geral}%`, [27, 174, 96]); // Verde
    this.addKPICard(80, 95, 'Total Reg.', metricas.geral.total_registros.toString(), [52, 159, 235]); // Azul
    this.addKPICard(140, 95, 'Alertas', metricas.geral.alertas_criticos.toString(), [231, 76, 60]); // Vermelho
  }

  private addTabelaEnsaios(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Relatório de Ensaios', 20, 140);

    const tableData = [
      ['Métrica', 'Valor'],
      ['Taxa de Conformidade', `${metricas.ensaios.taxa_conformidade}%`],
      ['Total de Ensaios', metricas.ensaios.total_ensaios.toString()],
      ['Ensaios Não Conformes', metricas.ensaios.ensaios_nao_conformes.toString()],
      ['Ensaios por Mês', metricas.ensaios.ensaios_por_mes.toString()],
    ];

    autoTable(this.doc, {
      startY: 150,
      head: [['Métrica', 'Valor']],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  }

  private addTabelaChecklists(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Relatório de Checklists', 20, 200);

    const tableData = [
      ['Métrica', 'Valor'],
      ['Conformidade Média', `${metricas.checklists.conformidade_media}%`],
      ['Total de Checklists', metricas.checklists.total_checklists.toString()],
      ['Checklists Concluídos', metricas.checklists.checklists_concluidos.toString()],
      ['Checklists Pendentes', metricas.checklists.checklists_pendentes.toString()],
    ];

    autoTable(this.doc, {
      startY: 210,
      head: [['Métrica', 'Valor']],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  }

  private addTabelaMateriais(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Relatório de Materiais', 20, 260);

    const tableData = [
      ['Métrica', 'Valor'],
      ['Taxa de Aprovação', `${metricas.materiais.taxa_aprovacao}%`],
      ['Total de Materiais', metricas.materiais.total_materiais.toString()],
      ['Materiais Aprovados', metricas.materiais.materiais_aprovados.toString()],
      ['Materiais Pendentes', metricas.materiais.materiais_pendentes.toString()],
    ];

    autoTable(this.doc, {
      startY: 270,
      head: [['Métrica', 'Valor']],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  }

  private addTabelaNaoConformidades(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Relatório de Não Conformidades', 20, 320);

    const tableData = [
      ['Métrica', 'Valor'],
      ['Taxa de Resolução', `${metricas.naoConformidades.taxa_resolucao}%`],
      ['Total de NCs', metricas.naoConformidades.total_ncs.toString()],
      ['NCs Resolvidas', metricas.naoConformidades.ncs_resolvidas.toString()],
      ['NCs Pendentes', metricas.naoConformidades.ncs_pendentes.toString()],
    ];

    autoTable(this.doc, {
      startY: 330,
      head: [['Métrica', 'Valor']],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  }

  private addTabelaDocumentos(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Relatório de Documentos', 20, 380);

    const tableData = [
      ['Métrica', 'Valor'],
      ['Total de Documentos', metricas.documentos.total_documentos.toString()],
      ['Documentos Aprovados', metricas.documentos.documentos_aprovados.toString()],
      ['Documentos Vencidos', metricas.documentos.documentos_vencidos.toString()],
      ['Documentos Pendentes', metricas.documentos.documentos_pendentes.toString()],
    ];

    autoTable(this.doc, {
      startY: 390,
      head: [['Métrica', 'Valor']],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  }

  private addResumoExecutivo(metricas: MetricasReais) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Resumo Executivo', 20, 440);

    this.doc.setFontSize(10);
    this.doc.setTextColor(52, 73, 94);
    
    const resumo = [
      `• Conformidade Geral: ${metricas.geral.conformidade_geral}%`,
      `• Total de Registos: ${metricas.geral.total_registros}`,
      `• Alertas Críticos: ${metricas.geral.alertas_criticos}`,
      `• Tendência de Qualidade: ${metricas.geral.tendencia_qualidade}`,
      '',
      'Análise:',
      `O sistema apresenta uma conformidade geral de ${metricas.geral.conformidade_geral}%, `,
      'indicando um bom nível de qualidade. Os alertas críticos estão sendo ',
      'monitorados e as tendências mostram evolução positiva.',
    ];

    let y = 450;
    resumo.forEach((linha) => {
      this.doc.text(linha, 20, y);
      y += 6;
    });
  }

  public gerarRelatorioExecutivo(options: RelatorioPDFOptions): void {
    this.addProfessionalHeader('Relatório Executivo de Qualidade', options.subtitulo);
    this.addMetricasGerais(options.metricas);
    this.addResumoExecutivo(options.metricas);
    this.addProfessionalFooter();
  }

  public gerarRelatorioEnsaios(options: RelatorioPDFOptions): void {
    this.addProfessionalHeader('Relatório de Ensaios', options.subtitulo);
    this.addTabelaEnsaios(options.metricas);
    this.addProfessionalFooter();
  }

  public gerarRelatorioChecklists(options: RelatorioPDFOptions): void {
    this.addProfessionalHeader('Relatório de Checklists', options.subtitulo);
    this.addTabelaChecklists(options.metricas);
    this.addProfessionalFooter();
  }

  public gerarRelatorioMateriais(options: RelatorioMateriaisOptions): void {
    try {
      this.doc = new jsPDF();
      this.pageNumber = 1;
      
      // Cabeçalho profissional
      this.addProfessionalHeader(options.titulo, options.subtitulo);
      
      let currentY = 85; // Posição inicial após cabeçalho
      
      // Estatísticas
      const stats = this.calcularEstatisticasMateriais(options.materiais);
      currentY = this.addEstatisticasMateriais(stats, currentY);
      
      // Conteúdo específico por tipo
      switch (options.tipo) {
        case "executivo":
          currentY = this.addRelatorioExecutivoMateriais(options, currentY);
          break;
        case "individual":
          currentY = this.addRelatorioIndividualMaterial(options, currentY);
          break;
        case "filtrado":
          currentY = this.addRelatorioFiltradoMateriais(options, currentY);
          break;
        case "comparativo":
          currentY = this.addRelatorioComparativoMateriais(options, currentY);
          break;
      }
      
      // Calcular total de páginas
      this.totalPages = Math.ceil(currentY / this.doc.internal.pageSize.height);
      
      // Adicionar rodapé em todas as páginas
      this.addFooterToAllPages();
      
      // Download com nome específico para relatório individual
      if (options.tipo === "individual" && options.materialEspecifico) {
        this.download(`ficha-tecnica-${options.materialEspecifico.codigo}.pdf`);
      } else {
        this.download(`relatorio_materiais_${options.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      
    } catch (error) {
      console.error("Erro ao gerar relatório de materiais:", error);
      throw error;
    }
  }

  private addFooterToAllPages() {
    // Adicionar rodapé apenas na página atual por enquanto
    this.addProfessionalFooter();
  }

  private calcularEstatisticasMateriais(materiais: Material[]) {
    const total = materiais.length;
    const aprovados = materiais.filter(m => m.estado === "aprovado").length;
    const pendentes = materiais.filter(m => m.estado === "pendente").length;
    const emAnalise = materiais.filter(m => m.estado === "em_analise").length;
    const reprovados = materiais.filter(m => m.estado === "reprovado").length;
    const concluidos = materiais.filter(m => m.estado === "concluido").length;
    
    const totalQuantidade = materiais.reduce((sum, m) => sum + m.quantidade, 0);
    const valorEstimado = totalQuantidade * 150; // Valor estimado por unidade
    
    const taxaAprovacao = total > 0 ? ((aprovados / total) * 100).toFixed(1) : "0";
    
    return {
      total,
      aprovados,
      pendentes,
      emAnalise,
      reprovados,
      concluidos,
      totalQuantidade,
      valorEstimado,
      taxaAprovacao
    };
  }

  private addEstatisticasMateriais(stats: any, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Cards de estatísticas com cores diferentes - Layout otimizado para A4
    this.addKPICard(20, startY + 5, 'Total', stats.total.toString(), [59, 130, 246]); // Azul
    this.addKPICard(65, startY + 5, 'Aprovados', stats.aprovados.toString(), [34, 197, 94]); // Verde
    this.addKPICard(110, startY + 5, 'Pendentes', stats.pendentes.toString(), [251, 146, 60]); // Laranja
    this.addKPICard(155, startY + 5, 'Em Análise', stats.emAnalise.toString(), [99, 102, 241]); // Roxo
    
    // Segunda linha de cards
    this.addKPICard(20, startY + 30, 'Taxa Aprovação', `${stats.taxaAprovacao}%`, [34, 197, 94]); // Verde
    this.addKPICard(65, startY + 30, 'Reprovados', stats.reprovados.toString(), [239, 68, 68]); // Vermelho
    this.addKPICard(110, startY + 30, 'Concluídos', stats.concluidos.toString(), [107, 114, 128]); // Cinza
    this.addKPICard(155, startY + 30, 'Valor Est.', `€${stats.valorEstimado.toLocaleString('pt-PT')}`, [16, 185, 129]); // Verde água
    
    return startY + 65;
  }

  private addRelatorioExecutivoMateriais(options: RelatorioMateriaisOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Tipo de Material', 20, startY);
    
    // Análise por tipo
    const analisePorTipo = options.materiais.reduce((acc, material) => {
      acc[material.tipo] = (acc[material.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tableData = Object.entries(analisePorTipo).map(([tipo, quantidade]) => [
      tipo.charAt(0).toUpperCase() + tipo.slice(1),
      quantidade.toString(),
      `${((quantidade / options.materiais.length) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Tipo de Material', 'Quantidade', 'Percentual']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Análise por estado
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Estado', 20, currentY);
    
    const analisePorEstado = options.materiais.reduce((acc, material) => {
      acc[material.estado] = (acc[material.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tableDataEstado = Object.entries(analisePorEstado).map(([estado, quantidade]) => [
      estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' '),
      quantidade.toString(),
      `${((quantidade / options.materiais.length) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Estado', 'Quantidade', 'Percentual']],
      body: tableDataEstado,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioIndividualMaterial(options: RelatorioMateriaisOptions, startY: number): number {
    if (!options.materialEspecifico) return startY;
    
    const material = options.materialEspecifico;
    
    // Cabeçalho do material com destaque
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('FICHA TÉCNICA DO MATERIAL', 20, startY);
    
    // Código em destaque
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(`Código: ${material.codigo}`, 20, startY + 12);
    
    // Nome do material
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text(`Nome: ${material.nome}`, 20, startY + 22);
    
    // Cards de status
    const statusColor = this.getStatusColor(material.estado);
    this.addStatusCard(120, startY + 5, material.estado, statusColor);
    
    // Seção 1: Informações Básicas
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, startY + 40);
    
    const basicData = [
      ['Campo', 'Valor'],
      ['Código', material.codigo],
      ['Nome', material.nome],
      ['Tipo', material.tipo.charAt(0).toUpperCase() + material.tipo.slice(1)],
      ['Estado', material.estado.charAt(0).toUpperCase() + material.estado.slice(1).replace('_', ' ')],
      ['Zona', material.zona],
      ['Lote', material.lote || 'N/A'],
      ['Responsável', material.responsavel],
    ];
    
    autoTable(this.doc, {
      startY: startY + 45,
      head: [['Campo', 'Valor']],
      body: basicData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Seção 2: Informações de Quantidade e Datas
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Quantidade e Datas', 20, currentY);
    
    const quantityData = [
      ['Campo', 'Valor'],
      ['Quantidade', `${material.quantidade} ${material.unidade}`],
      ['Data de Receção', new Date(material.data_rececao).toLocaleDateString('pt-PT')],
      ['Data de Criação', new Date(material.data_criacao).toLocaleDateString('pt-PT')],
      ['Data de Modificação', 'N/A'],
    ];
    
    autoTable(this.doc, {
      startY: currentY + 5,
      head: [['Campo', 'Valor']],
      body: quantityData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Seção 3: Observações (se existirem)
    if (material.observacoes && material.observacoes.trim()) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Observações', 20, currentY);
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      // Quebrar observações em linhas se necessário
      const maxWidth = 170;
      const words = material.observacoes.split(' ');
      let line = '';
      let lineY = currentY + 8;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        // Estimativa simples de largura (aproximadamente 6px por caractere)
        if ((testLine.length * 6) < maxWidth) {
          line = testLine;
        } else {
          this.doc.text(line, 20, lineY);
          line = word + ' ';
          lineY += 5;
        }
      });
      
      if (line) {
        this.doc.text(line, 20, lineY);
        currentY = lineY + 10;
      } else {
        currentY += 15;
      }
    }
    
    // Seção 4: Histórico de Estados (simulado)
    currentY += 5;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Histórico de Estados', 20, currentY);
    
    const historyData = [
      ['Data', 'Estado', 'Responsável'],
      [new Date(material.data_criacao).toLocaleDateString('pt-PT'), 'Criado', material.responsavel],
      [new Date(material.data_rececao).toLocaleDateString('pt-PT'), 'Recebido', material.responsavel],
      [new Date().toLocaleDateString('pt-PT'), material.estado.charAt(0).toUpperCase() + material.estado.slice(1).replace('_', ' '), material.responsavel],
    ];
    
    autoTable(this.doc, {
      startY: currentY + 5,
      head: [['Data', 'Estado', 'Responsável']],
      body: historyData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioFiltradoMateriais(options: RelatorioMateriaisOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Lista de Materiais Filtrados', 20, startY);
    
    // Informações dos filtros aplicados
    if (options.filtros) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(75, 85, 99);
      this.doc.text('Filtros aplicados:', 20, startY + 10);
      
      let filterY = startY + 20;
      let filterCount = 0;
      Object.entries(options.filtros).forEach(([key, value]) => {
        if (value) {
          const label = this.getFilterLabel(key);
          this.doc.setFontSize(9);
          this.doc.setFont('helvetica', 'normal');
          this.doc.setTextColor(107, 114, 128);
          this.doc.text(`${label}: ${value}`, 25, filterY);
          filterY += 5;
          filterCount++;
        }
      });
      
      if (filterCount === 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Nenhum filtro aplicado', 25, filterY);
        filterY += 5;
      }
      
      startY = filterY + 10;
    }
    
    // Tabela de materiais
    const tableData = options.materiais.map(material => [
      material.codigo,
      material.nome,
      material.tipo.charAt(0).toUpperCase() + material.tipo.slice(1),
      material.estado.charAt(0).toUpperCase() + material.estado.slice(1).replace('_', ' '),
      material.zona,
      new Date(material.data_rececao).toLocaleDateString('pt-PT'),
      `${material.quantidade} ${material.unidade}`,
      material.responsavel
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Nome', 'Tipo', 'Estado', 'Zona', 'Data Receção', 'Quantidade', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoMateriais(options: RelatorioMateriaisOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    // Comparação por estado
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Estado', 20, startY + 15);
    
    const analisePorEstado = options.materiais.reduce((acc, material) => {
      acc[material.estado] = (acc[material.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tableDataEstado = Object.entries(analisePorEstado).map(([estado, quantidade]) => [
      estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' '),
      quantidade.toString(),
      `${((quantidade / options.materiais.length) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 20,
      head: [['Estado', 'Quantidade', 'Percentual']],
      body: tableDataEstado,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por tipo
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Tipo', 20, currentY);
    
    const analisePorTipo = options.materiais.reduce((acc, material) => {
      acc[material.tipo] = (acc[material.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tableDataTipo = Object.entries(analisePorTipo).map(([tipo, quantidade]) => [
      tipo.charAt(0).toUpperCase() + tipo.slice(1),
      quantidade.toString(),
      `${((quantidade / options.materiais.length) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableDataTipo,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getFilterLabel(key: string): string {
    const labels: Record<string, string> = {
      search: 'Pesquisa',
      tipo: 'Tipo',
      estado: 'Estado',
      zona: 'Zona',
      fornecedor: 'Fornecedor',
      dataInicio: 'Data Início',
      dataFim: 'Data Fim'
    };
    return labels[key] || key;
  }

  public gerarRelatorioNaoConformidades(options: RelatorioPDFOptions): void {
    this.addProfessionalHeader('Relatório de Não Conformidades', options.subtitulo);
    this.addTabelaNaoConformidades(options.metricas);
    this.addProfessionalFooter();
  }

  public gerarRelatorioDocumentos(options: RelatorioPDFOptions): void {
    this.addProfessionalHeader('Relatório de Documentos', options.subtitulo);
    this.addTabelaDocumentos(options.metricas);
    this.addProfessionalFooter();
  }

  public gerarRelatorioCompleto(options: RelatorioPDFOptions): void {
    this.addProfessionalHeader('Relatório Completo de Qualidade', options.subtitulo);
    this.addMetricasGerais(options.metricas);
    
    // Adicionar nova página para cada seção
    this.doc.addPage();
    this.addTabelaEnsaios(options.metricas);
    
    this.doc.addPage();
    this.addTabelaChecklists(options.metricas);
    
    this.doc.addPage();
    this.addTabelaMateriais(options.metricas);
    
    this.doc.addPage();
    this.addTabelaNaoConformidades(options.metricas);
    
    this.doc.addPage();
    this.addTabelaDocumentos(options.metricas);
    
    this.addProfessionalFooter();
  }

  public download(filename: string): void {
    this.doc.save(filename);
  }

  // Métodos para Relatórios de Obras
  public async generateObrasExecutiveReport(obras: Obra[]): Promise<void> {
    console.log('PDFService: Iniciando relatório executivo com', obras.length, 'obras');
    
    try {
      const options: RelatorioObrasOptions = {
        titulo: 'Relatório Executivo de Obras',
        subtitulo: 'Visão Geral e Indicadores de Performance',
        obras,
        tipo: 'executivo'
      };
      
      console.log('PDFService: Gerando relatório...');
      this.gerarRelatorioExecutivoObras(options);
      
      console.log('PDFService: Fazendo download...');
      this.download(`relatorio-obras-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
      
      console.log('PDFService: Relatório executivo concluído!');
    } catch (error) {
      console.error('PDFService: Erro no relatório executivo:', error);
      throw error;
    }
  }

  public async generateObrasFilteredReport(obras: Obra[], filtros: any): Promise<void> {
    const options: RelatorioObrasOptions = {
      titulo: 'Relatório Filtrado de Obras',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      obras,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoObras(options);
    this.download(`relatorio-obras-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateObrasComparativeReport(obras: Obra[]): Promise<void> {
    const options: RelatorioObrasOptions = {
      titulo: 'Relatório Comparativo de Obras',
      subtitulo: 'Análise Comparativa e Benchmarks',
      obras,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoObras(options);
    this.download(`relatorio-obras-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateObrasIndividualReport(obras: Obra[]): Promise<void> {
    if (obras.length !== 1) {
      throw new Error('Relatório individual deve conter apenas uma obra');
    }
    
    const obra = obras[0];
    const options: RelatorioObrasOptions = {
      titulo: `Relatório Individual - ${obra.nome}`,
      subtitulo: `Código: ${obra.codigo} | Cliente: ${obra.cliente}`,
      obras,
      tipo: 'individual'
    };
    this.gerarRelatorioIndividualObra(options);
    this.download(`relatorio-obras-individual-${obra.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoObras(options: RelatorioObrasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasObras(options.obras, startY);
    currentY = this.addRelatorioExecutivoObras(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoObras(options: RelatorioObrasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosObras(options.filtros, startY);
    currentY = this.addRelatorioFiltradoObras(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoObras(options: RelatorioObrasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoObras(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualObra(options: RelatorioObrasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualObra(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualObra(options: RelatorioObrasOptions, startY: number): number {
    const obra = options.obras[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(59, 130, 246); // Azul
    this.doc.rect(15, startY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Obra', 20, startY + 2);
    
    // KPIs alinhados: Status, Valor Contrato, Valor Executado, Progresso
    const statusColors = {
      'em_execucao': [34, 197, 94], // Verde
      'concluida': [16, 185, 129], // Verde escuro
      'paralisada': [245, 158, 11], // Amarelo
      'cancelada': [239, 68, 68], // Vermelho
      'planeamento': [168, 85, 247] // Roxo
    };
    
    const statusColor = statusColors[obra.status] || [107, 114, 128];
    const statusText = this.getStatusTextObra(obra.status);
    
    // KPIs: 4 cards, espaçados
    const kpiY = startY + 12;
    this.addKPICard(20, kpiY, 'Status', statusText, statusColor);
    this.addKPICard(65, kpiY, 'Valor Contrato', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato), [59, 130, 246]);
    this.addKPICard(110, kpiY, 'Valor Executado', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_executado), [34, 197, 94]);
    this.addKPICard(155, kpiY, 'Progresso', `${obra.percentual_execucao}%`, [251, 146, 60]);
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 30;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 40, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const infoBasicas = [
      `Código: ${obra.codigo}`,
      `Nome: ${obra.nome}`,
      `Cliente: ${obra.cliente}`,
      `Localização: ${obra.localizacao}`,
      `Tipo: ${obra.tipo_obra.charAt(0).toUpperCase() + obra.tipo_obra.slice(1)}`,
      `Categoria: ${obra.categoria.charAt(0).toUpperCase() + obra.categoria.slice(1)}`
    ];
    
    let currentY = infoY + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
    
    // Datas e valores - sem bordas, apenas fundo colorido
    const datasY = infoY + 42;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, datasY - 5, 180, 35, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Datas e Valores', 20, datasY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const datasValores = [
      `Data de Início: ${new Date(obra.data_inicio).toLocaleDateString('pt-PT')}`,
      `Data Fim Prevista: ${new Date(obra.data_fim_prevista).toLocaleDateString('pt-PT')}`,
      obra.data_fim_real ? `Data Fim Real: ${new Date(obra.data_fim_real).toLocaleDateString('pt-PT')}` : null,
      `Percentual de Execução: ${obra.percentual_execucao}%`
    ].filter(Boolean);
    
    currentY = datasY + 12;
    datasValores.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
    
    // Equipa técnica - sem bordas, apenas fundo colorido
    const equipaY = datasY + 37;
    this.doc.setFillColor(240, 249, 255); // Azul claro
    this.doc.rect(15, equipaY - 5, 180, 32, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Equipa Técnica', 20, equipaY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const equipaTecnica = [
      `Responsável Técnico: ${obra.responsavel_tecnico}`,
      `Coordenador de Obra: ${obra.coordenador_obra}`,
      `Fiscal de Obra: ${obra.fiscal_obra}`,
      `Engenheiro Responsável: ${obra.engenheiro_responsavel}`,
      `Arquiteto: ${obra.arquiteto}`
    ];
    
    currentY = equipaY + 12;
    equipaTecnica.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
    
    // Observações - sem bordas, apenas fundo colorido
    if (obra.observacoes) {
      const obsY = equipaY + 37;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, obsY - 5, 180, 25, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Observações', 20, obsY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      // Quebrar texto em linhas
      const maxWidth = 160;
      const words = obra.observacoes.split(' ');
      let line = '';
      currentY = obsY + 12;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = this.doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && line !== '') {
          this.doc.text(line, 25, currentY);
          line = word + ' ';
          currentY += 5;
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        this.doc.text(line, 25, currentY);
        currentY += 5;
      }
      
      // Verificar se há espaço suficiente para o rodapé
      const pageHeight = this.doc.internal.pageSize.height;
      const footerHeight = 30;
      const minSpace = 15;
      
      if (currentY + footerHeight + minSpace > pageHeight) {
        this.doc.addPage();
        return 30;
      }
      
      return currentY + 10;
    }
    
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.height;
    const footerHeight = 30;
    const minSpace = 15;
    
    if (equipaY + 32 + footerHeight + minSpace > pageHeight) {
      this.doc.addPage();
      return 30;
    }
    
    return equipaY + 32;
  }

  private calcularEstatisticasObras(obras: Obra[]) {
    const stats = {
      total: obras.length,
      em_execucao: obras.filter(o => o.status === 'em_execucao').length,
      concluidas: obras.filter(o => o.status === 'concluida').length,
      paralisadas: obras.filter(o => o.status === 'paralisada').length,
      canceladas: obras.filter(o => o.status === 'cancelada').length,
      planeamento: obras.filter(o => o.status === 'planeamento').length,
      valor_total: obras.reduce((acc, o) => acc + o.valor_contrato, 0),
      valor_executado: obras.reduce((acc, o) => acc + o.valor_executado, 0),
      percentual_medio: obras.length > 0 ? obras.reduce((acc, o) => acc + o.percentual_execucao, 0) / obras.length : 0,
      por_tipo: obras.reduce((acc, o) => {
        acc[o.tipo_obra] = (acc[o.tipo_obra] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      por_categoria: obras.reduce((acc, o) => {
        acc[o.categoria] = (acc[o.categoria] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  }

  private addEstatisticasObras(obras: Obra[], startY: number): number {
    const stats = this.calcularEstatisticasObras(obras);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Indicadores de Performance', 20, startY);
    
    // Cards de KPI - Primeira linha (4 cards)
    this.addKPICard(20, startY + 10, 'Total Obras', stats.total.toString(), [59, 130, 246]); // Azul
    this.addKPICard(65, startY + 10, 'Em Execução', stats.em_execucao.toString(), [34, 197, 94]); // Verde
    this.addKPICard(110, startY + 10, 'Concluídas', stats.concluidas.toString(), [16, 185, 129]); // Verde escuro
    this.addKPICard(155, startY + 10, 'Paralisadas', stats.paralisadas.toString(), [245, 158, 11]); // Amarelo
    
    // Segunda linha (4 cards)
    this.addKPICard(20, startY + 35, 'Valor Total', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(stats.valor_total), [168, 85, 247]); // Roxo
    this.addKPICard(65, startY + 35, 'Valor Executado', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(stats.valor_executado), [251, 146, 60]); // Laranja
    this.addKPICard(110, startY + 35, 'Progresso Médio', `${stats.percentual_medio.toFixed(1)}%`, [236, 72, 153]); // Rosa
    this.addKPICard(155, startY + 35, 'Canceladas', stats.canceladas.toString(), [239, 68, 68]); // Vermelho
    
    return startY + 65;
  }

  private addRelatorioExecutivoObras(options: RelatorioObrasOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasObras(options.obras);
    const percentualExecucao = stats.valor_total > 0 ? (stats.valor_executado / stats.valor_total) * 100 : 0;
    
    const resumo = [
      `• Total de obras em gestão: ${stats.total}`,
      `• Obras em execução: ${stats.em_execucao} (${((stats.em_execucao / stats.total) * 100).toFixed(1)}%)`,
      `• Obras concluídas: ${stats.concluidas} (${((stats.concluidas / stats.total) * 100).toFixed(1)}%)`,
      `• Valor total dos contratos: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.valor_total)}`,
      `• Valor executado: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.valor_executado)}`,
      `• Percentual de execução financeira: ${percentualExecucao.toFixed(1)}%`,
      `• Progresso físico médio: ${stats.percentual_medio.toFixed(1)}%`
    ];
    
    let currentY = startY + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Tabela de obras principais
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Principais Obras', 20, currentY);
    
    const obrasPrincipais = options.obras
      .sort((a, b) => b.valor_contrato - a.valor_contrato)
      .slice(0, 10);
    
    const tableData = obrasPrincipais.map(obra => [
      obra.codigo,
      obra.nome,
      obra.cliente,
      new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato),
      `${obra.percentual_execucao}%`,
      this.getStatusTextObra(obra.status)
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Código', 'Nome', 'Cliente', 'Valor Contrato', 'Progresso', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addFiltrosObras(filtros: any, startY: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    if (filtros) {
      let filterY = startY + 15;
      let filterCount = 0;
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          const label = this.getFilterLabelObra(key);
          this.doc.setFontSize(9);
          this.doc.setFont('helvetica', 'normal');
          this.doc.setTextColor(107, 114, 128);
          this.doc.text(`${label}: ${value}`, 25, filterY);
          filterY += 5;
          filterCount++;
        }
      });
      
      if (filterCount === 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Nenhum filtro aplicado', 25, filterY);
        filterY += 5;
      }
      
      return filterY + 10;
    }
    
    return startY + 20;
  }

  private addRelatorioFiltradoObras(options: RelatorioObrasOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Obras Filtradas', 20, startY);
    
    // Tabela de obras
    const tableData = options.obras.map(obra => [
      obra.codigo,
      obra.nome,
      obra.cliente,
      obra.localizacao,
      new Date(obra.data_inicio).toLocaleDateString('pt-PT'),
      new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato),
      `${obra.percentual_execucao}%`,
      this.getStatusTextObra(obra.status),
      obra.responsavel_tecnico
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Nome', 'Cliente', 'Localização', 'Início', 'Valor', 'Progresso', 'Status', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoObras(options: RelatorioObrasOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    const stats = this.calcularEstatisticasObras(options.obras);
    
    // Comparação por status
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Status', 20, startY + 15);
    
    const analisePorStatus = {
      'Em Execução': stats.em_execucao,
      'Concluídas': stats.concluidas,
      'Paralisadas': stats.paralisadas,
      'Canceladas': stats.canceladas,
      'Planeamento': stats.planeamento
    };
    
    const tableDataStatus = Object.entries(analisePorStatus).map(([status, quantidade]) => [
      status,
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 20,
      head: [['Status', 'Quantidade', 'Percentual']],
      body: tableDataStatus,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por tipo de obra
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Tipo de Obra', 20, currentY);
    
    const tableDataTipo = Object.entries(stats.por_tipo).map(([tipo, quantidade]) => [
      tipo.charAt(0).toUpperCase() + tipo.slice(1),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableDataTipo,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por categoria
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Categoria', 20, currentY);
    
    const tableDataCategoria = Object.entries(stats.por_categoria).map(([categoria, quantidade]) => [
      categoria.charAt(0).toUpperCase() + categoria.slice(1),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Categoria', 'Quantidade', 'Percentual']],
      body: tableDataCategoria,
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getFilterLabelObra(key: string): string {
    const labels: Record<string, string> = {
      status: 'Status',
      tipo_obra: 'Tipo de Obra',
      categoria: 'Categoria',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Fim'
    };
    return labels[key] || key;
  }

  private getStatusTextObra(status: string): string {
    switch (status) {
      case 'em_execucao': return 'Em Execução';
      case 'concluida': return 'Concluída';
      case 'paralisada': return 'Paralisada';
      case 'cancelada': return 'Cancelada';
      case 'planeamento': return 'Planeamento';
      default: return status;
    }
  }

  // Métodos para Relatórios de Ensaios
  public async generateEnsaiosExecutiveReport(ensaios: Ensaio[]): Promise<void> {
    console.log('PDFService: Iniciando relatório executivo de ensaios com', ensaios.length, 'ensaios');
    
    try {
      const options: RelatorioEnsaiosOptions = {
        titulo: 'Relatório Executivo de Ensaios',
        subtitulo: 'Visão Geral e Indicadores de Conformidade',
        ensaios,
        tipo: 'executivo'
      };
      
      console.log('PDFService: Gerando relatório...');
      this.gerarRelatorioExecutivoEnsaios(options);
      
      console.log('PDFService: Fazendo download...');
      this.download(`relatorio-ensaios-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
      
      console.log('PDFService: Relatório executivo concluído!');
    } catch (error) {
      console.error('PDFService: Erro no relatório executivo:', error);
      throw error;
    }
  }

  public async generateEnsaiosFilteredReport(ensaios: Ensaio[], filtros: any): Promise<void> {
    const options: RelatorioEnsaiosOptions = {
      titulo: 'Relatório Filtrado de Ensaios',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      ensaios,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoEnsaios(options);
    this.download(`relatorio-ensaios-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateEnsaiosComparativeReport(ensaios: Ensaio[]): Promise<void> {
    const options: RelatorioEnsaiosOptions = {
      titulo: 'Relatório Comparativo de Ensaios',
      subtitulo: 'Análise Comparativa e Benchmarks',
      ensaios,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoEnsaios(options);
    this.download(`relatorio-ensaios-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateEnsaiosIndividualReport(ensaios: Ensaio[]): Promise<void> {
    if (ensaios.length !== 1) {
      throw new Error('Relatório individual deve conter apenas um ensaio');
    }
    
    const ensaio = ensaios[0];
    const options: RelatorioEnsaiosOptions = {
      titulo: `Relatório Individual - ${ensaio.tipo}`,
      subtitulo: `Código: ${ensaio.codigo} | Laboratório: ${ensaio.laboratorio}`,
      ensaios,
      tipo: 'individual'
    };
    this.gerarRelatorioIndividualEnsaio(options);
    this.download(`relatorio-ensaios-individual-${ensaio.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoEnsaios(options: RelatorioEnsaiosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasEnsaios(options.ensaios, startY);
    currentY = this.addRelatorioExecutivoEnsaios(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoEnsaios(options: RelatorioEnsaiosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosEnsaios(options.filtros, startY);
    currentY = this.addRelatorioFiltradoEnsaios(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoEnsaios(options: RelatorioEnsaiosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoEnsaios(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualEnsaio(options: RelatorioEnsaiosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualEnsaio(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualEnsaio(options: RelatorioEnsaiosOptions, startY: number): number {
    const ensaio = options.ensaios[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(59, 130, 246); // Azul
    this.doc.rect(15, startY - 5, 180, 12, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica do Ensaio', 20, startY + 3);
    
    // KPIs alinhados: Status, Valor Obtido, Valor Esperado, Conformidade
    const statusColors = {
      'aprovado': [34, 197, 94], // Verde
      'pendente': [245, 158, 11], // Amarelo
      'em_analise': [99, 102, 241], // Índigo
      'reprovado': [239, 68, 68], // Vermelho
      'concluido': [168, 85, 247] // Roxo
    };
    const statusColor = statusColors[ensaio.estado] || [107, 114, 128];
    const estadoText = this.getEstadoTextEnsaio(ensaio.estado);

    // KPIs: 4 cards, espaçados
    const kpiY = startY + 15;
    this.addKPICard(20, kpiY, 'Status', estadoText, statusColor);
    this.addKPICard(65, kpiY, 'Valor Obtido', `${ensaio.valor_obtido} ${ensaio.unidade}`, [59, 130, 246]); // Azul
    this.addKPICard(110, kpiY, 'Valor Esperado', `${ensaio.valor_esperado} ${ensaio.unidade}`, [34, 197, 94]); // Verde
    this.addKPICard(155, kpiY, 'Conformidade', ensaio.conforme ? 'Conforme' : 'Não Conforme', ensaio.conforme ? [16, 185, 129] : [239, 68, 68]); // Verde/Vermelho
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 35;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const infoBasicas = [
      `Código: ${ensaio.codigo}`,
      `Tipo: ${ensaio.tipo}`,
      `Laboratório: ${ensaio.laboratorio}`,
      `Responsável: ${ensaio.responsavel}`,
      `Zona: ${ensaio.zona}`
    ];
    
    let currentY = infoY + 15;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Resultados - sem bordas, apenas fundo colorido
    const resultadosY = infoY + 55;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, resultadosY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resultados do Ensaio', 20, resultadosY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const resultados = [
      `Data do Ensaio: ${new Date(ensaio.data_ensaio).toLocaleDateString('pt-PT')}`,
      `Valor Obtido: ${ensaio.valor_obtido} ${ensaio.unidade}`,
      `Valor Esperado: ${ensaio.valor_esperado} ${ensaio.unidade}`,
      `Resultado: ${ensaio.resultado}`,
      `Conformidade: ${ensaio.conforme ? 'Conforme' : 'Não Conforme'}`
    ];
    
    currentY = resultadosY + 15;
    resultados.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Observações - sem bordas, apenas fundo colorido
    if (ensaio.observacoes) {
      const obsY = resultadosY + 50;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, obsY - 5, 180, 30, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Observações', 20, obsY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      // Quebrar texto em linhas
      const maxWidth = 160;
      const words = ensaio.observacoes.split(' ');
      let line = '';
      currentY = obsY + 15;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = this.doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && line !== '') {
          this.doc.text(line, 25, currentY);
          line = word + ' ';
          currentY += 6;
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        this.doc.text(line, 25, currentY);
        currentY += 6;
      }
      
      // Verificar se há espaço suficiente para o rodapé
      const pageHeight = this.doc.internal.pageSize.height;
      const footerHeight = 30; // Altura estimada do rodapé
      const minSpace = 20; // Espaço mínimo entre conteúdo e rodapé
      
      if (currentY + footerHeight + minSpace > pageHeight) {
        // Adicionar nova página se necessário
        this.doc.addPage();
        return 30; // Retornar posição inicial da nova página
      }
      
      return currentY + 15;
    }
    
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.height;
    const footerHeight = 30; // Altura estimada do rodapé
    const minSpace = 20; // Espaço mínimo entre conteúdo e rodapé
    
    if (resultadosY + 50 + footerHeight + minSpace > pageHeight) {
      // Adicionar nova página se necessário
      this.doc.addPage();
      return 30; // Retornar posição inicial da nova página
    }
    
    return resultadosY + 50;
  }

  private calcularEstatisticasEnsaios(ensaios: Ensaio[]) {
    const stats = {
      total: ensaios.length,
      conformes: ensaios.filter(e => e.conforme).length,
      nao_conformes: ensaios.filter(e => !e.conforme).length,
      aprovados: ensaios.filter(e => e.estado === 'aprovado').length,
      pendentes: ensaios.filter(e => e.estado === 'pendente').length,
      em_analise: ensaios.filter(e => e.estado === 'em_analise').length,
      reprovados: ensaios.filter(e => e.estado === 'reprovado').length,
      concluidos: ensaios.filter(e => e.estado === 'concluido').length,
      percentual_conformidade: ensaios.length > 0 ? (ensaios.filter(e => e.conforme).length / ensaios.length) * 100 : 0,
      laboratorios_unicos: new Set(ensaios.map(e => e.laboratorio)).size,
      por_tipo: ensaios.reduce((acc, e) => {
        acc[e.tipo] = (acc[e.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      por_laboratorio: ensaios.reduce((acc, e) => {
        acc[e.laboratorio] = (acc[e.laboratorio] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  }

  private addEstatisticasEnsaios(ensaios: Ensaio[], startY: number): number {
    const stats = this.calcularEstatisticasEnsaios(ensaios);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Indicadores de Conformidade', 20, startY);
    
    // Cards de KPI - Primeira linha (4 cards)
    this.addKPICard(20, startY + 10, 'Total Ensaios', stats.total.toString(), [59, 130, 246]); // Azul
    this.addKPICard(65, startY + 10, 'Conformes', stats.conformes.toString(), [34, 197, 94]); // Verde
    this.addKPICard(110, startY + 10, 'Não Conformes', stats.nao_conformes.toString(), [239, 68, 68]); // Vermelho
    this.addKPICard(155, startY + 10, 'Aprovados', stats.aprovados.toString(), [16, 185, 129]); // Verde escuro
    
    // Segunda linha (4 cards)
    this.addKPICard(20, startY + 35, 'Taxa Conformidade', `${stats.percentual_conformidade.toFixed(1)}%`, [168, 85, 247]); // Roxo
    this.addKPICard(65, startY + 35, 'Pendentes', stats.pendentes.toString(), [245, 158, 11]); // Amarelo
    this.addKPICard(110, startY + 35, 'Em Análise', stats.em_analise.toString(), [99, 102, 241]); // Índigo
    this.addKPICard(155, startY + 35, 'Laboratórios', stats.laboratorios_unicos.toString(), [251, 146, 60]); // Laranja
    
    return startY + 65;
  }

  private addRelatorioExecutivoEnsaios(options: RelatorioEnsaiosOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasEnsaios(options.ensaios);
    
    const resumo = [
      `• Total de ensaios realizados: ${stats.total}`,
      `• Ensaios conformes: ${stats.conformes} (${stats.percentual_conformidade.toFixed(1)}%)`,
      `• Ensaios não conformes: ${stats.nao_conformes} (${((stats.nao_conformes / stats.total) * 100).toFixed(1)}%)`,
      `• Ensaios aprovados: ${stats.aprovados} (${((stats.aprovados / stats.total) * 100).toFixed(1)}%)`,
      `• Ensaios pendentes: ${stats.pendentes} (${((stats.pendentes / stats.total) * 100).toFixed(1)}%)`,
      `• Laboratórios utilizados: ${stats.laboratorios_unicos}`,
      `• Taxa de conformidade geral: ${stats.percentual_conformidade.toFixed(1)}%`
    ];
    
    let currentY = startY + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Tabela de ensaios principais
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Principais Ensaios', 20, currentY);
    
    const ensaiosPrincipais = options.ensaios
      .sort((a, b) => new Date(b.data_ensaio).getTime() - new Date(a.data_ensaio).getTime())
      .slice(0, 10);
    
    const tableData = ensaiosPrincipais.map(ensaio => [
      ensaio.codigo,
      ensaio.tipo.substring(0, 20) + (ensaio.tipo.length > 20 ? '...' : ''),
      ensaio.laboratorio.substring(0, 15) + (ensaio.laboratorio.length > 15 ? '...' : ''),
      `${ensaio.valor_obtido} ${ensaio.unidade}`,
      ensaio.conforme ? 'Conforme' : 'Não Conforme',
      this.getEstadoTextEnsaio(ensaio.estado)
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Código', 'Tipo', 'Laboratório', 'Resultado', 'Conformidade', 'Estado']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addFiltrosEnsaios(filtros: any, startY: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    if (filtros) {
      let filterY = startY + 15;
      let filterCount = 0;
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          const label = this.getFilterLabelEnsaio(key);
          this.doc.setFontSize(9);
          this.doc.setFont('helvetica', 'normal');
          this.doc.setTextColor(107, 114, 128);
          this.doc.text(`${label}: ${value}`, 25, filterY);
          filterY += 5;
          filterCount++;
        }
      });
      
      if (filterCount === 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Nenhum filtro aplicado', 25, filterY);
        filterY += 5;
      }
      
      return filterY + 10;
    }
    
    return startY + 20;
  }

  private addRelatorioFiltradoEnsaios(options: RelatorioEnsaiosOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Ensaios Filtrados', 20, startY);
    
    // Tabela de ensaios
    const tableData = options.ensaios.map(ensaio => [
      ensaio.codigo,
      ensaio.tipo.substring(0, 25) + (ensaio.tipo.length > 25 ? '...' : ''),
      ensaio.laboratorio.substring(0, 20) + (ensaio.laboratorio.length > 20 ? '...' : ''),
      new Date(ensaio.data_ensaio).toLocaleDateString('pt-PT'),
      `${ensaio.valor_obtido} ${ensaio.unidade}`,
      ensaio.conforme ? 'Conforme' : 'Não Conforme',
      this.getEstadoTextEnsaio(ensaio.estado),
      ensaio.responsavel
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Nome', 'Cliente', 'Localização', 'Início', 'Valor', 'Progresso', 'Status', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoEnsaios(options: RelatorioEnsaiosOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    const stats = this.calcularEstatisticasEnsaios(options.ensaios);
    
    // Comparação por estado
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Estado', 20, startY + 15);
    
    const analisePorEstado = {
      'Aprovados': stats.aprovados,
      'Pendentes': stats.pendentes,
      'Em Análise': stats.em_analise,
      'Reprovados': stats.reprovados,
      'Concluídos': stats.concluidos
    };
    
    const tableDataEstado = Object.entries(analisePorEstado).map(([estado, quantidade]) => [
      estado,
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 20,
      head: [['Estado', 'Quantidade', 'Percentual']],
      body: tableDataEstado,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por tipo de ensaio
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Tipo de Ensaio', 20, currentY);
    
    const tableDataTipo = Object.entries(stats.por_tipo).map(([tipo, quantidade]) => [
      tipo.substring(0, 20) + (tipo.length > 20 ? '...' : ''),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableDataTipo,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por laboratório
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Laboratório', 20, currentY);
    
    const tableDataLaboratorio = Object.entries(stats.por_laboratorio).map(([laboratorio, quantidade]) => [
      laboratorio.substring(0, 20) + (laboratorio.length > 20 ? '...' : ''),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Laboratório', 'Quantidade', 'Percentual']],
      body: tableDataLaboratorio,
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getFilterLabelEnsaio(key: string): string {
    const labels: Record<string, string> = {
      tipo: 'Tipo de Ensaio',
      estado: 'Estado',
      laboratorio: 'Laboratório',
      conforme: 'Conformidade',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Fim'
    };
    return labels[key] || key;
  }

  private getEstadoTextEnsaio(estado: string): string {
    switch (estado) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'reprovado': return 'Reprovado';
      case 'concluido': return 'Concluído';
      default: return estado;
    }
  }

  private getStatusTextRFI(status: string): string {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'respondido': return 'Respondido';
      case 'fechado': return 'Fechado';
      default: return status;
    }
  }

  // Métodos para Relatórios de RFIs
  public async generateRFIsExecutiveReport(rfis: RFI[]): Promise<void> {
    console.log('PDFService: Iniciando relatório executivo de RFIs com', rfis.length, 'RFIs');
    
    try {
      const options: RelatorioRFIsOptions = {
        titulo: 'Relatório Executivo de RFIs',
        subtitulo: 'Visão Geral e Indicadores de Conformidade',
        rfis,
        tipo: 'executivo'
      };
      
      console.log('PDFService: Gerando relatório...');
      this.gerarRelatorioExecutivoRFIs(options);
      
      console.log('PDFService: Fazendo download...');
      this.download(`relatorio-rfis-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
      
      console.log('PDFService: Relatório executivo concluído!');
    } catch (error) {
      console.error('PDFService: Erro no relatório executivo:', error);
      throw error;
    }
  }

  public async generateRFIsFilteredReport(rfis: RFI[], filtros: any): Promise<void> {
    const options: RelatorioRFIsOptions = {
      titulo: 'Relatório Filtrado de RFIs',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      rfis,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoRFIs(options);
    this.download(`relatorio-rfis-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateRFIsComparativeReport(rfis: RFI[]): Promise<void> {
    const options: RelatorioRFIsOptions = {
      titulo: 'Relatório Comparativo de RFIs',
      subtitulo: 'Análise Comparativa e Benchmarks',
      rfis,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoRFIs(options);
    this.download(`relatorio-rfis-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateRFIsIndividualReport(rfis: RFI[]): Promise<void> {
    if (rfis.length !== 1) {
      throw new Error('Relatório individual deve conter apenas um RFI');
    }
    
    const rfi = rfis[0];
    const options: RelatorioRFIsOptions = {
      titulo: `Relatório Individual - ${rfi.numero}`,
      subtitulo: `Código: ${rfi.codigo} | Solicitante: ${rfi.solicitante}`,
      rfis,
      tipo: 'individual'
    };
    this.gerarRelatorioIndividualRFI(options);
    this.download(`relatorio-rfis-individual-${rfi.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoRFIs(options: RelatorioRFIsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasRFIs(options.rfis, startY);
    currentY = this.addRelatorioExecutivoRFIs(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoRFIs(options: RelatorioRFIsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosRFIs(options.filtros, startY);
    currentY = this.addRelatorioFiltradoRFIs(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoRFIs(options: RelatorioRFIsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoRFIs(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualRFI(options: RelatorioRFIsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualRFI(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualRFI(options: RelatorioRFIsOptions, startY: number): number {
    const rfi = options.rfis[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(59, 130, 246); // Azul
    this.doc.rect(15, startY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica do RFI', 20, startY + 2);
    
    // KPIs alinhados: Status, Prioridade, Impacto Custo, Impacto Prazo
    const statusColors = {
      'pendente': [245, 158, 11], // Amarelo
      'em_analise': [99, 102, 241], // Índigo
      'respondido': [34, 197, 94], // Verde
      'fechado': [168, 85, 247] // Roxo
    };
    const statusColor = statusColors[rfi.status] || [107, 114, 128];
    const statusText = this.getStatusTextRFI(rfi.status);

    // KPIs: 4 cards, espaçados
    const kpiY = startY + 12;
    this.addKPICard(20, kpiY, 'Status', statusText, statusColor);
    this.addKPICard(65, kpiY, 'Prioridade', rfi.prioridade.charAt(0).toUpperCase() + rfi.prioridade.slice(1), [59, 130, 246]); // Azul
    this.addKPICard(110, kpiY, 'Impacto Custo', rfi.impacto_custo ? `€${rfi.impacto_custo}` : 'N/A', [34, 197, 94]); // Verde
    this.addKPICard(155, kpiY, 'Impacto Prazo', rfi.impacto_prazo ? `${rfi.impacto_prazo} dias` : 'N/A', [251, 146, 60]); // Laranja
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 30;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 40, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const infoBasicas = [
      `Código: ${rfi.codigo}`,
      `Número: ${rfi.numero}`,
      `Título: ${rfi.titulo}`,
      `Solicitante: ${rfi.solicitante}`,
      `Destinatário: ${rfi.destinatario}`
    ];
    
    let currentY = infoY + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
    
    // Datas e detalhes - sem bordas, apenas fundo colorido
    const datasY = infoY + 42;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, datasY - 5, 180, 35, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Datas e Detalhes', 20, datasY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const datasDetalhes = [
      `Data de Solicitação: ${new Date(rfi.data_solicitacao).toLocaleDateString('pt-PT')}`,
      rfi.data_resposta ? `Data de Resposta: ${new Date(rfi.data_resposta).toLocaleDateString('pt-PT')}` : null,
      `Prioridade: ${rfi.prioridade.charAt(0).toUpperCase() + rfi.prioridade.slice(1)}`,
      rfi.impacto_custo ? `Impacto no Custo: €${rfi.impacto_custo}` : null,
      rfi.impacto_prazo ? `Impacto no Prazo: ${rfi.impacto_prazo} dias` : null
    ].filter(Boolean);
    
    currentY = datasY + 12;
    datasDetalhes.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
    
    // Descrição - sem bordas, apenas fundo colorido
    const descricaoY = datasY + 37;
    this.doc.setFillColor(240, 249, 255); // Azul claro
    this.doc.rect(15, descricaoY - 5, 180, 32, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Descrição', 20, descricaoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    // Quebrar descrição em linhas
    const maxWidth = 160;
    const words = rfi.descricao.split(' ');
    let line = '';
    currentY = descricaoY + 12;
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const testWidth = this.doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && line !== '') {
        this.doc.text(line, 25, currentY);
        line = word + ' ';
        currentY += 5;
      } else {
        line = testLine;
      }
    });
    
    if (line) {
      this.doc.text(line, 25, currentY);
      currentY += 5;
    }
    
    // Resposta (se existir)
    if (rfi.resposta) {
      const respostaY = descricaoY + 37;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, respostaY - 5, 180, 25, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Resposta', 20, respostaY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      // Quebrar resposta em linhas
      const wordsResposta = rfi.resposta.split(' ');
      let lineResposta = '';
      currentY = respostaY + 12;
      
      wordsResposta.forEach(word => {
        const testLine = lineResposta + word + ' ';
        const testWidth = this.doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && lineResposta !== '') {
          this.doc.text(lineResposta, 25, currentY);
          lineResposta = word + ' ';
          currentY += 5;
        } else {
          lineResposta = testLine;
        }
      });
      
      if (lineResposta) {
        this.doc.text(lineResposta, 25, currentY);
        currentY += 5;
      }
      
      // Verificar se há espaço suficiente para o rodapé
      const pageHeight = this.doc.internal.pageSize.height;
      const footerHeight = 30;
      const minSpace = 15;
      
      if (currentY + footerHeight + minSpace > pageHeight) {
        this.doc.addPage();
        return 30;
      }
      
      return currentY + 10;
    }
    
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.height;
    const footerHeight = 30;
    const minSpace = 15;
    
    if (descricaoY + 32 + footerHeight + minSpace > pageHeight) {
      this.doc.addPage();
      return 30;
    }
    
    return descricaoY + 32;
  }

  private calcularEstatisticasRFIs(rfis: RFI[]) {
    const stats = {
      total: rfis.length,
      pendentes: rfis.filter(r => r.status === 'pendente').length,
      em_analise: rfis.filter(r => r.status === 'em_analise').length,
      respondidos: rfis.filter(r => r.status === 'respondido').length,
      fechados: rfis.filter(r => r.status === 'fechado').length,
      alta_prioridade: rfis.filter(r => r.prioridade === 'alta').length,
      media_prioridade: rfis.filter(r => r.prioridade === 'media').length,
      baixa_prioridade: rfis.filter(r => r.prioridade === 'baixa').length,
      urgente_prioridade: rfis.filter(r => r.prioridade === 'urgente').length,
      percentual_respondidos: rfis.length > 0 ? (rfis.filter(r => r.status === 'respondido').length / rfis.length) * 100 : 0,
      solicitantes_unicos: new Set(rfis.map(r => r.solicitante)).size,
      por_prioridade: rfis.reduce((acc, r) => {
        acc[r.prioridade] = (acc[r.prioridade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      por_status: rfis.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  }

  private addEstatisticasRFIs(rfis: RFI[], startY: number): number {
    const stats = this.calcularEstatisticasRFIs(rfis);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Indicadores de RFIs', 20, startY);
    
    // Cards de KPI - Primeira linha (4 cards)
    this.addKPICard(20, startY + 10, 'Total RFIs', stats.total.toString(), [59, 130, 246]); // Azul
    this.addKPICard(65, startY + 10, 'Pendentes', stats.pendentes.toString(), [245, 158, 11]); // Amarelo
    this.addKPICard(110, startY + 10, 'Em Análise', stats.em_analise.toString(), [99, 102, 241]); // Índigo
    this.addKPICard(155, startY + 10, 'Respondidos', stats.respondidos.toString(), [34, 197, 94]); // Verde
    
    // Segunda linha (4 cards)
    this.addKPICard(20, startY + 35, 'Taxa Resposta', `${stats.percentual_respondidos.toFixed(1)}%`, [168, 85, 247]); // Roxo
    this.addKPICard(65, startY + 35, 'Alta Prioridade', stats.alta_prioridade.toString(), [239, 68, 68]); // Vermelho
    this.addKPICard(110, startY + 35, 'Urgente', stats.urgente_prioridade.toString(), [220, 38, 127]); // Rosa
    this.addKPICard(155, startY + 35, 'Solicitantes', stats.solicitantes_unicos.toString(), [251, 146, 60]); // Laranja
    
    return startY + 65;
  }

  private addRelatorioExecutivoRFIs(options: RelatorioRFIsOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasRFIs(options.rfis);
    
    const resumo = [
      `• Total de RFIs em gestão: ${stats.total}`,
      `• RFIs em análise: ${stats.em_analise} (${((stats.em_analise / stats.total) * 100).toFixed(1)}%)`,
      `• RFIs pendentes: ${stats.pendentes} (${((stats.pendentes / stats.total) * 100).toFixed(1)}%)`,
      `• RFIs respondidos: ${stats.respondidos} (${((stats.respondidos / stats.total) * 100).toFixed(1)}%)`,
      `• RFIs fechados: ${stats.fechados} (${((stats.fechados / stats.total) * 100).toFixed(1)}%)`,
      `• Solicitantes únicos: ${stats.solicitantes_unicos}`,
      `• Taxa de resposta geral: ${stats.percentual_respondidos.toFixed(1)}%`
    ];
    
    let currentY = startY + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Tabela de RFIs principais
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Principais RFIs', 20, currentY);
    
    const rfisPrincipais = options.rfis
      .sort((a, b) => new Date(b.data_solicitacao).getTime() - new Date(a.data_solicitacao).getTime())
      .slice(0, 10);
    
    const tableData = rfisPrincipais.map(rfi => [
      rfi.codigo,
      rfi.titulo.substring(0, 20) + (rfi.titulo.length > 20 ? '...' : ''),
      rfi.solicitante.substring(0, 15) + (rfi.solicitante.length > 15 ? '...' : ''),
      rfi.prioridade.charAt(0).toUpperCase() + rfi.prioridade.slice(1),
      this.getStatusTextRFI(rfi.status),
      new Date(rfi.data_solicitacao).toLocaleDateString('pt-PT')
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Código', 'Título', 'Solicitante', 'Prioridade', 'Status', 'Data']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addFiltrosRFIs(filtros: any, startY: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    if (filtros) {
      let filterY = startY + 15;
      let filterCount = 0;
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          const label = this.getFilterLabelRFI(key);
          this.doc.setFontSize(9);
          this.doc.setFont('helvetica', 'normal');
          this.doc.setTextColor(107, 114, 128);
          this.doc.text(`${label}: ${value}`, 25, filterY);
          filterY += 5;
          filterCount++;
        }
      });
      
      if (filterCount === 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Nenhum filtro aplicado', 25, filterY);
        filterY += 5;
      }
      
      return filterY + 10;
    }
    
    return startY + 20;
  }

  private addRelatorioFiltradoRFIs(options: RelatorioRFIsOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('RFIs Filtrados', 20, startY);
    
    // Tabela de RFIs
    const tableData = options.rfis.map(rfi => [
      rfi.codigo,
      rfi.titulo.substring(0, 25) + (rfi.titulo.length > 25 ? '...' : ''),
      rfi.solicitante.substring(0, 20) + (rfi.solicitante.length > 20 ? '...' : ''),
      new Date(rfi.data_solicitacao).toLocaleDateString('pt-PT'),
      rfi.prioridade.charAt(0).toUpperCase() + rfi.prioridade.slice(1),
      this.getStatusTextRFI(rfi.status),
      rfi.destinatario
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Título', 'Solicitante', 'Data', 'Prioridade', 'Status', 'Destinatário']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoRFIs(options: RelatorioRFIsOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    const stats = this.calcularEstatisticasRFIs(options.rfis);
    
    // Comparação por prioridade
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Prioridade', 20, startY + 15);
    
    const tableDataPrioridade = Object.entries(stats.por_prioridade).map(([prioridade, quantidade]) => [
      prioridade.charAt(0).toUpperCase() + prioridade.slice(1),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 20,
      head: [['Prioridade', 'Quantidade', 'Percentual']],
      body: tableDataPrioridade,
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por status
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Status', 20, currentY);
    
    const analisePorStatus = {
      'Em Análise': stats.em_analise,
      'Pendentes': stats.pendentes,
      'Respondidos': stats.respondidos,
      'Fechados': stats.fechados
    };
    
    const tableDataStatus = Object.entries(analisePorStatus).map(([status, quantidade]) => [
      status,
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 20,
      head: [['Status', 'Quantidade', 'Percentual']],
      body: tableDataStatus,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getFilterLabelRFI(key: string): string {
    const labels: Record<string, string> = {
      tipo: 'Tipo de RFI',
      estado: 'Estado',
      categoria: 'Categoria',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Fim'
    };
    return labels[key] || key;
  }

  private getEstadoTextRFI(estado: string): string {
    switch (estado) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'reprovado': return 'Reprovado';
      case 'concluido': return 'Concluído';
      default: return estado;
    }
  }

  // Métodos para Relatórios de Checklists
  public async generateChecklistsExecutiveReport(checklists: Checklist[]): Promise<void> {
    console.log('PDFService: Iniciando relatório executivo de checklists com', checklists.length, 'checklists');
    
    try {
      const options: RelatorioChecklistsOptions = {
        titulo: 'Relatório Executivo de Checklists',
        subtitulo: 'Visão Geral e Indicadores de Conformidade',
        checklists,
        tipo: 'executivo'
      };
      
      console.log('PDFService: Gerando relatório...');
      this.gerarRelatorioExecutivoChecklists(options);
      
      console.log('PDFService: Fazendo download...');
      this.download(`relatorio-checklists-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
      
      console.log('PDFService: Relatório executivo concluído!');
    } catch (error) {
      console.error('PDFService: Erro no relatório executivo:', error);
      throw error;
    }
  }

  public async generateChecklistsFilteredReport(checklists: Checklist[], filtros: any): Promise<void> {
    const options: RelatorioChecklistsOptions = {
      titulo: 'Relatório Filtrado de Checklists',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      checklists,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoChecklists(options);
    this.download(`relatorio-checklists-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateChecklistsComparativeReport(checklists: Checklist[]): Promise<void> {
    const options: RelatorioChecklistsOptions = {
      titulo: 'Relatório Comparativo de Checklists',
      subtitulo: 'Análise Comparativa e Benchmarks',
      checklists,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoChecklists(options);
    this.download(`relatorio-checklists-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateChecklistsIndividualReport(checklists: Checklist[]): Promise<void> {
    if (checklists.length !== 1) {
      throw new Error('Relatório individual deve conter apenas uma checklist');
    }
    
    const checklist = checklists[0];
         const options: RelatorioChecklistsOptions = {
       titulo: `Relatório Individual - ${checklist.titulo}`,
       subtitulo: `Código: ${checklist.codigo} | Obra: ${checklist.obra}`,
       checklists,
       tipo: 'individual'
     };
    this.gerarRelatorioIndividualChecklist(options);
    this.download(`relatorio-checklists-individual-${checklist.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoChecklists(options: RelatorioChecklistsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasChecklists(options.checklists, startY);
    currentY = this.addRelatorioExecutivoChecklists(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoChecklists(options: RelatorioChecklistsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosChecklists(options.filtros, startY);
    currentY = this.addRelatorioFiltradoChecklists(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoChecklists(options: RelatorioChecklistsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoChecklists(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualChecklist(options: RelatorioChecklistsOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualChecklist(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualChecklist(options: RelatorioChecklistsOptions, startY: number): number {
    const checklist = options.checklists[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(59, 130, 246); // Azul
    this.doc.rect(15, startY - 5, 180, 12, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Checklist', 20, startY + 3);
    
    // KPIs alinhados: Status, Conformidade, Data de Criação, Data de Modificação
    const statusColors = {
      'aprovado': [34, 197, 94], // Verde
      'pendente': [245, 158, 11], // Amarelo
      'em_analise': [99, 102, 241], // Índigo
      'reprovado': [239, 68, 68], // Vermelho
      'concluido': [168, 85, 247] // Roxo
    };
    const statusColor = statusColors[checklist.status] || [107, 114, 128];
    const statusText = this.getStatusTextChecklist(checklist.status);

    // KPIs: 4 cards, espaçados
    const kpiY = startY + 15;
         this.addKPICard(20, kpiY, 'Status', statusText, statusColor);
     this.addKPICard(65, kpiY, 'Estado', checklist.estado.charAt(0).toUpperCase() + checklist.estado.slice(1), [16, 185, 129]); // Verde
     this.addKPICard(110, kpiY, 'Data de Criação', new Date(checklist.data_criacao).toLocaleDateString('pt-PT'), [34, 197, 94]); // Verde
     this.addKPICard(155, kpiY, 'Data de Atualização', new Date(checklist.data_atualizacao).toLocaleDateString('pt-PT'), [251, 146, 60]); // Laranja
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 35;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
         const infoBasicas = [
       `Código: ${checklist.codigo}`,
       `Título: ${checklist.titulo}`,
       `Obra: ${checklist.obra}`,
       `Status: ${checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1)}`,
       `Responsável: ${checklist.responsavel}`
     ];
    
    let currentY = infoY + 15;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Detalhes - sem bordas, apenas fundo colorido
    const detalhesY = infoY + 55;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, detalhesY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes da Checklist', 20, detalhesY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
         const detalhes = [
       `Status: ${checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1)}`,
       `Data de Criação: ${new Date(checklist.data_criacao).toLocaleDateString('pt-PT')}`,
       `Data de Atualização: ${new Date(checklist.data_atualizacao).toLocaleDateString('pt-PT')}`,
       `Estado: ${checklist.estado.charAt(0).toUpperCase() + checklist.estado.slice(1)}`,
       `Responsável: ${checklist.responsavel}`
     ];
    
    currentY = detalhesY + 15;
    detalhes.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Itens - sem bordas, apenas fundo colorido
    const itensY = detalhesY + 55;
    this.doc.setFillColor(240, 249, 255); // Azul claro
    this.doc.rect(15, itensY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Itens da Checklist', 20, itensY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
         checklist.pontos.forEach((ponto, index) => {
       this.doc.text(`${index + 1}. ${ponto.descricao}`, 25, currentY);
       currentY += 6;
     });
    
    // Observações - sem bordas, apenas fundo colorido
    if (checklist.observacoes) {
      const obsY = itensY + 45;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, obsY - 5, 180, 30, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Observações', 20, obsY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      // Quebrar observações em linhas
      const maxWidth = 160;
      const words = checklist.observacoes.split(' ');
      let line = '';
      currentY = obsY + 15;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = this.doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && line !== '') {
          this.doc.text(line, 25, currentY);
          line = word + ' ';
          currentY += 5;
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        this.doc.text(line, 25, currentY);
        currentY += 5;
      }
      
      // Verificar se há espaço suficiente para o rodapé
      const pageHeight = this.doc.internal.pageSize.height;
      const footerHeight = 30;
      const minSpace = 15;
      
      if (currentY + footerHeight + minSpace > pageHeight) {
        this.doc.addPage();
        return 30;
      }
      
      return currentY + 10;
    }
    
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.height;
    const footerHeight = 30;
    const minSpace = 15;
    
    if (itensY + 45 + footerHeight + minSpace > pageHeight) {
      this.doc.addPage();
      return 30;
    }
    
    return itensY + 45;
  }

     private calcularEstatisticasChecklists(checklists: Checklist[]) {
     const stats = {
       total: checklists.length,
       aprovados: checklists.filter(c => c.status === 'aprovado').length,
       em_andamento: checklists.filter(c => c.status === 'em_andamento').length,
       concluidos: checklists.filter(c => c.status === 'concluido').length,
       reprovados: checklists.filter(c => c.status === 'reprovado').length,
       percentual_aprovacao: checklists.length > 0 ? (checklists.filter(c => c.status === 'aprovado').length / checklists.length) * 100 : 0,
       obras_unicas: new Set(checklists.map(c => c.obra)).size,
       por_obra: checklists.reduce((acc, c) => {
         acc[c.obra] = (acc[c.obra] || 0) + 1;
         return acc;
       }, {} as Record<string, number>),
       por_status: checklists.reduce((acc, c) => {
         acc[c.status] = (acc[c.status] || 0) + 1;
         return acc;
       }, {} as Record<string, number>)
     };
     
     return stats;
   }

  private addEstatisticasChecklists(checklists: Checklist[], startY: number): number {
    const stats = this.calcularEstatisticasChecklists(checklists);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Indicadores de Checklists', 20, startY);
    
    // Cards de KPI - Primeira linha (4 cards)
    this.addKPICard(20, startY + 10, 'Total Checklists', stats.total.toString(), [59, 130, 246]); // Azul
    this.addKPICard(65, startY + 10, 'Aprovados', stats.aprovados.toString(), [34, 197, 94]); // Verde
    this.addKPICard(110, startY + 10, 'Em Andamento', stats.em_andamento.toString(), [245, 158, 11]); // Amarelo
    this.addKPICard(155, startY + 10, 'Concluídos', stats.concluidos.toString(), [16, 185, 129]); // Verde escuro
    
    // Segunda linha (4 cards)
    this.addKPICard(20, startY + 35, 'Taxa Aprovação', `${stats.percentual_aprovacao.toFixed(1)}%`, [168, 85, 247]); // Roxo
    this.addKPICard(65, startY + 35, 'Reprovados', stats.reprovados.toString(), [239, 68, 68]); // Vermelho
    this.addKPICard(110, startY + 35, 'Obras Únicas', stats.obras_unicas.toString(), [99, 102, 241]); // Índigo
    this.addKPICard(155, startY + 35, 'Status', '4 Tipos', [251, 146, 60]); // Laranja
    
    return startY + 65;
  }

  private addRelatorioExecutivoChecklists(options: RelatorioChecklistsOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasChecklists(options.checklists);
    
    const resumo = [
      `• Total de checklists realizadas: ${stats.total}`,
      `• Checklists aprovadas: ${stats.aprovados} (${stats.percentual_aprovacao.toFixed(1)}%)`,
      `• Checklists em andamento: ${stats.em_andamento}`,
      `• Checklists concluídas: ${stats.concluidos}`,
      `• Checklists reprovadas: ${stats.reprovados}`,
      `• Obras únicas: ${stats.obras_unicas}`
    ];
    
    let currentY = startY + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Tabela de checklists principais
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Principais Checklists', 20, currentY);
    
    const checklistsPrincipais = options.checklists
      .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
      .slice(0, 10);
    
    const tableData = checklistsPrincipais.map(checklist => [
      checklist.codigo,
      checklist.titulo.substring(0, 20) + (checklist.titulo.length > 20 ? '...' : ''),
      checklist.obra.substring(0, 15) + (checklist.obra.length > 15 ? '...' : ''),
      checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1),
      this.getStatusTextChecklist(checklist.status),
      new Date(checklist.data_criacao).toLocaleDateString('pt-PT')
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Código', 'Título', 'Obra', 'Status', 'Status Texto', 'Data']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addFiltrosChecklists(filtros: any, startY: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    if (filtros) {
      let filterY = startY + 15;
      let filterCount = 0;
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          const label = this.getFilterLabelChecklist(key);
          this.doc.setFontSize(9);
          this.doc.setFont('helvetica', 'normal');
          this.doc.setTextColor(107, 114, 128);
          this.doc.text(`${label}: ${value}`, 25, filterY);
          filterY += 5;
          filterCount++;
        }
      });
      
      if (filterCount === 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Nenhum filtro aplicado', 25, filterY);
        filterY += 5;
      }
      
      return filterY + 10;
    }
    
    return startY + 20;
  }

  private addRelatorioFiltradoChecklists(options: RelatorioChecklistsOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Checklists Filtradas', 20, startY);
    
    // Tabela de checklists
    const tableData = options.checklists.map(checklist => [
      checklist.codigo,
      checklist.titulo.substring(0, 25) + (checklist.titulo.length > 25 ? '...' : ''),
      checklist.obra.substring(0, 20) + (checklist.obra.length > 20 ? '...' : ''),
      new Date(checklist.data_criacao).toLocaleDateString('pt-PT'),
      checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1),
      checklist.responsavel
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Título', 'Obra', 'Data', 'Status', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoChecklists(options: RelatorioChecklistsOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    const stats = this.calcularEstatisticasChecklists(options.checklists);
    
    // Comparação por obra
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Obra', 20, startY + 15);
    
    const tableDataObra = Object.entries(stats.por_obra).map(([obra, quantidade]) => [
      obra,
      quantidade.toString(),
      `${((quantidade as number / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 20,
      head: [['Obra', 'Quantidade', 'Percentual']],
      body: tableDataObra,
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por status
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Status', 20, currentY);
    
    const analisePorStatus = {
      'Aprovado': stats.aprovados,
      'Em Andamento': stats.em_andamento,
      'Concluído': stats.concluidos,
      'Reprovado': stats.reprovados
    };
    
    const tableDataStatus = Object.entries(analisePorStatus).map(([status, quantidade]) => [
      status,
      quantidade.toString(),
      `${((quantidade as number / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 20,
      head: [['Status', 'Quantidade', 'Percentual']],
      body: tableDataStatus,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getFilterLabelChecklist(key: string): string {
    const labels: Record<string, string> = {
      titulo: 'Título',
      obra: 'Obra',
      status: 'Status',
      estado: 'Estado',
      responsavel: 'Responsável',
      zona: 'Zona',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Fim'
    };
    return labels[key] || key;
  }

  private getStatusTextChecklist(status: string): string {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'reprovado': return 'Reprovado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  }

  // Métodos para Relatórios de Documentos
  public async generateDocumentosExecutiveReport(documentos: Documento[]): Promise<void> {
    console.log('PDFService: Iniciando relatório executivo de documentos com', documentos.length, 'documentos');
    
    try {
      const options: RelatorioDocumentosOptions = {
        titulo: 'Relatório Executivo de Documentos',
        subtitulo: 'Visão Geral e Indicadores de Conformidade',
        documentos,
        tipo: 'executivo'
      };
      
      console.log('PDFService: Gerando relatório...');
      this.gerarRelatorioExecutivoDocumentos(options);
      
      console.log('PDFService: Fazendo download...');
      this.download(`relatorio-documentos-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
      
      console.log('PDFService: Relatório executivo concluído!');
    } catch (error) {
      console.error('PDFService: Erro no relatório executivo:', error);
      throw error;
    }
  }

  public async generateDocumentosFilteredReport(documentos: Documento[], filtros: any): Promise<void> {
    const options: RelatorioDocumentosOptions = {
      titulo: 'Relatório Filtrado de Documentos',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      documentos,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoDocumentos(options);
    this.download(`relatorio-documentos-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateDocumentosComparativeReport(documentos: Documento[]): Promise<void> {
    const options: RelatorioDocumentosOptions = {
      titulo: 'Relatório Comparativo de Documentos',
      subtitulo: 'Análise Comparativa e Benchmarks',
      documentos,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoDocumentos(options);
    this.download(`relatorio-documentos-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateDocumentosIndividualReport(documentos: Documento[]): Promise<void> {
    if (documentos.length !== 1) {
      throw new Error('Relatório individual deve conter apenas um documento');
    }
    
    const documento = documentos[0];
         const options: RelatorioDocumentosOptions = {
       titulo: `Relatório Individual - ${documento.codigo}`,
       subtitulo: `Código: ${documento.codigo} | Tipo: ${documento.tipo}`,
       documentos,
       tipo: 'individual'
     };
    this.gerarRelatorioIndividualDocumento(options);
    this.download(`relatorio-documentos-individual-${documento.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoDocumentos(options: RelatorioDocumentosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasDocumentos(options.documentos, startY);
    currentY = this.addRelatorioExecutivoDocumentos(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoDocumentos(options: RelatorioDocumentosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosDocumentos(options.filtros, startY);
    currentY = this.addRelatorioFiltradoDocumentos(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoDocumentos(options: RelatorioDocumentosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoDocumentos(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualDocumento(options: RelatorioDocumentosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualDocumento(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualDocumento(options: RelatorioDocumentosOptions, startY: number): number {
    const documento = options.documentos[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(59, 130, 246); // Azul
    this.doc.rect(15, startY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica do Documento', 20, startY + 2);
    
         // KPIs alinhados: Estado, Versão, Data de Criação, Data de Atualização
     const estadoColors = {
       'aprovado': [34, 197, 94], // Verde
       'pendente': [245, 158, 11], // Amarelo
       'em_analise': [99, 102, 241], // Índigo
       'reprovado': [239, 68, 68], // Vermelho
       'concluido': [168, 85, 247] // Roxo
     };
     const estadoColor = estadoColors[documento.estado] || [107, 114, 128];
     const estadoText = this.getStatusTextDocumento(documento.estado);

     // KPIs: 4 cards, espaçados
     const kpiY = startY + 15;
     this.addKPICard(20, kpiY, 'Estado', estadoText, estadoColor);
     this.addKPICard(65, kpiY, 'Versão', documento.versao, [16, 185, 129]); // Verde
     this.addKPICard(110, kpiY, 'Data de Criação', new Date(documento.data_criacao).toLocaleDateString('pt-PT'), [34, 197, 94]); // Verde
     this.addKPICard(155, kpiY, 'Data de Atualização', new Date(documento.data_atualizacao).toLocaleDateString('pt-PT'), [251, 146, 60]); // Laranja
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 35;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
         const infoBasicas = [
       `Código: ${documento.codigo}`,
       `Tipo: ${documento.tipo}`,
       `Versão: ${documento.versao}`,
       `Estado: ${documento.estado.charAt(0).toUpperCase() + documento.estado.slice(1)}`,
       `Responsável: ${documento.responsavel}`
     ];
    
    let currentY = infoY + 15;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Detalhes - sem bordas, apenas fundo colorido
    const detalhesY = infoY + 55;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, detalhesY - 5, 180, 45, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes do Documento', 20, detalhesY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
         const detalhes = [
       `Estado: ${documento.estado.charAt(0).toUpperCase() + documento.estado.slice(1)}`,
       `Data de Criação: ${new Date(documento.data_criacao).toLocaleDateString('pt-PT')}`,
       `Data de Atualização: ${new Date(documento.data_atualizacao).toLocaleDateString('pt-PT')}`,
       `Versão: ${documento.versao}`,
       `Responsável: ${documento.responsavel}`
     ];
    
    currentY = detalhesY + 15;
    detalhes.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Observações - sem bordas, apenas fundo colorido
    if (documento.observacoes) {
      const obsY = detalhesY + 50;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, obsY - 5, 180, 30, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Observações', 20, obsY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      // Quebrar observações em linhas
      const maxWidth = 160;
      const words = documento.observacoes.split(' ');
      let line = '';
      currentY = obsY + 15;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = this.doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && line !== '') {
          this.doc.text(line, 25, currentY);
          line = word + ' ';
          currentY += 5;
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        this.doc.text(line, 25, currentY);
        currentY += 5;
      }
      
      // Verificar se há espaço suficiente para o rodapé
      const pageHeight = this.doc.internal.pageSize.height;
      const footerHeight = 30;
      const minSpace = 15;
      
      if (currentY + footerHeight + minSpace > pageHeight) {
        this.doc.addPage();
        return 30;
      }
      
      return currentY + 10;
    }
    
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.height;
    const footerHeight = 30;
    const minSpace = 15;
    
    if (detalhesY + 50 + footerHeight + minSpace > pageHeight) {
      this.doc.addPage();
      return 30;
    }
    
    return detalhesY + 50;
  }

  private calcularEstatisticasDocumentos(documentos: Documento[]) {
    const stats = {
      total: documentos.length,
      aprovados: documentos.filter(d => d.estado === 'aprovado').length,
      pendentes: documentos.filter(d => d.estado === 'pendente').length,
      em_analise: documentos.filter(d => d.estado === 'em_analise').length,
      reprovados: documentos.filter(d => d.estado === 'reprovado').length,
      concluidos: documentos.filter(d => d.estado === 'concluido').length,
      percentual_aprovacao: documentos.length > 0 ? (documentos.filter(d => d.estado === 'aprovado').length / documentos.length) * 100 : 0,
      tipos_unicos: new Set(documentos.map(d => d.tipo)).size,
      por_tipo: documentos.reduce((acc, d) => {
        acc[d.tipo] = (acc[d.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      por_estado: documentos.reduce((acc, d) => {
        acc[d.estado] = (acc[d.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  }

  private addEstatisticasDocumentos(documentos: Documento[], startY: number): number {
    const stats = this.calcularEstatisticasDocumentos(documentos);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Indicadores de Documentos', 20, startY);
    
    // Cards de KPI - Primeira linha (4 cards)
    this.addKPICard(20, startY + 10, 'Total Documentos', stats.total.toString(), [59, 130, 246]); // Azul
    this.addKPICard(65, startY + 10, 'Aprovados', stats.aprovados.toString(), [34, 197, 94]); // Verde
    this.addKPICard(110, startY + 10, 'Pendentes', stats.pendentes.toString(), [251, 146, 60]); // Laranja
    this.addKPICard(155, startY + 10, 'Em Análise', stats.em_analise.toString(), [99, 102, 241]); // Roxo
    
    // Segunda linha (4 cards)
    this.addKPICard(20, startY + 35, 'Taxa Aprovação', `${stats.percentual_aprovacao.toFixed(1)}%`, [168, 85, 247]); // Roxo
    this.addKPICard(65, startY + 35, 'Reprovados', stats.reprovados.toString(), [239, 68, 68]); // Vermelho
    this.addKPICard(110, startY + 35, 'Tipos Únicos', stats.tipos_unicos.toString(), [99, 102, 241]); // Índigo
    this.addKPICard(155, startY + 35, 'Status', '4 Tipos', [251, 146, 60]); // Laranja
    
    return startY + 65;
  }

  private addRelatorioExecutivoDocumentos(options: RelatorioDocumentosOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasDocumentos(options.documentos);
    
    const resumo = [
      `• Total de documentos realizados: ${stats.total}`,
      `• Documentos aprovados: ${stats.aprovados} (${stats.percentual_aprovacao.toFixed(1)}%)`,
      `• Documentos pendentes: ${stats.pendentes}`,
      `• Documentos em análise: ${stats.em_analise}`,
      `• Documentos reprovados: ${stats.reprovados}`,
      `• Tipos únicos: ${stats.tipos_unicos}`
    ];
    
    let currentY = startY + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Tabela de documentos principais
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Principais Documentos', 20, currentY);
    
    const documentosPrincipais = options.documentos
      .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
      .slice(0, 10);
    
         const tableData = documentosPrincipais.map(documento => [
       documento.codigo,
       documento.codigo.substring(0, 20) + (documento.codigo.length > 20 ? '...' : ''),
       documento.tipo.substring(0, 15) + (documento.tipo.length > 15 ? '...' : ''),
       documento.estado.charAt(0).toUpperCase() + documento.estado.slice(1),
       this.getStatusTextDocumento(documento.estado),
       new Date(documento.data_criacao).toLocaleDateString('pt-PT')
     ]);
    
    autoTable(this.doc, {
      startY: currentY + 8,
      head: [['Código', 'Título', 'Tipo', 'Status', 'Status Texto', 'Data']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addFiltrosDocumentos(filtros: any, startY: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    if (filtros) {
      let filterY = startY + 15;
      let filterCount = 0;
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          const label = this.getFilterLabelDocumento(key);
          this.doc.setFontSize(9);
          this.doc.setFont('helvetica', 'normal');
          this.doc.setTextColor(107, 114, 128);
          this.doc.text(`${label}: ${value}`, 25, filterY);
          filterY += 5;
          filterCount++;
        }
      });
      
      if (filterCount === 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Nenhum filtro aplicado', 25, filterY);
        filterY += 5;
      }
      
      return filterY + 10;
    }
    
    return startY + 20;
  }

  private addRelatorioFiltradoDocumentos(options: RelatorioDocumentosOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Documentos Filtrados', 20, startY);
    
    // Tabela de documentos
         const tableData = options.documentos.map(documento => [
       documento.codigo,
       documento.codigo.substring(0, 25) + (documento.codigo.length > 25 ? '...' : ''),
       documento.tipo.substring(0, 20) + (documento.tipo.length > 20 ? '...' : ''),
       new Date(documento.data_criacao).toLocaleDateString('pt-PT'),
       documento.estado.charAt(0).toUpperCase() + documento.estado.slice(1),
       documento.responsavel
     ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Título', 'Tipo', 'Data', 'Status', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 6,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoDocumentos(options: RelatorioDocumentosOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    const stats = this.calcularEstatisticasDocumentos(options.documentos);
    
    // Comparação por tipo
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Tipo', 20, startY + 15);
    
    const tableDataTipo = Object.entries(stats.por_tipo).map(([tipo, quantidade]) => [
      tipo.substring(0, 20) + (tipo.length > 20 ? '...' : ''),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 20,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableDataTipo,
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    let currentY = (this.doc as any).lastAutoTable.finalY + 15;
    
    // Comparação por status
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Distribuição por Status', 20, currentY);
    
    const analisePorStatus = {
      'Aprovado': stats.aprovados,
      'Pendentes': stats.pendentes,
      'Em Análise': stats.em_analise,
      'Reprovados': stats.reprovados
    };
    
    const tableDataStatus = Object.entries(analisePorStatus).map(([status, quantidade]) => [
      status,
      quantidade.toString(),
      `${((quantidade as number / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 20,
      head: [['Status', 'Quantidade', 'Percentual']],
      body: tableDataStatus,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 20, right: 20 },
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getFilterLabelDocumento(key: string): string {
    const labels: Record<string, string> = {
      titulo: 'Título',
      tipo: 'Tipo',
      status: 'Status',
      estado: 'Estado',
      responsavel: 'Responsável',
      zona: 'Zona',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Fim'
    };
    return labels[key] || key;
  }

  private getStatusTextDocumento(status: string): string {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'reprovado': return 'Reprovado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  }

  // Métodos para Relatórios de Fornecedores
  public async generateFornecedoresExecutiveReport(fornecedores: Fornecedor[]): Promise<void> {
    const options: RelatorioFornecedoresOptions = {
      titulo: 'Relatório Executivo de Fornecedores',
      subtitulo: 'Visão Geral e Indicadores de Performance',
      fornecedores,
      tipo: 'executivo'
    };
    this.gerarRelatorioExecutivoFornecedores(options);
    this.download(`relatorio-fornecedores-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateFornecedoresFilteredReport(fornecedores: Fornecedor[], filtros: any): Promise<void> {
    const options: RelatorioFornecedoresOptions = {
      titulo: 'Relatório Filtrado de Fornecedores',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      fornecedores,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoFornecedores(options);
    this.download(`relatorio-fornecedores-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateFornecedoresComparativeReport(fornecedores: Fornecedor[]): Promise<void> {
    const options: RelatorioFornecedoresOptions = {
      titulo: 'Relatório Comparativo de Fornecedores',
      subtitulo: 'Análise Comparativa e Benchmarks',
      fornecedores,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoFornecedores(options);
    this.download(`relatorio-fornecedores-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateFornecedoresIndividualReport(fornecedores: Fornecedor[]): Promise<void> {
    if (fornecedores.length !== 1) {
      throw new Error('Relatório individual deve conter apenas um fornecedor');
    }
    
    const fornecedor = fornecedores[0];
    const options: RelatorioFornecedoresOptions = {
      titulo: `Relatório Individual - ${fornecedor.nome}`,
      subtitulo: `NIF: ${fornecedor.nif} | Estado: ${this.getEstadoTextFornecedor(fornecedor.estado)}`,
      fornecedores,
      tipo: 'individual'
    };
    this.gerarRelatorioIndividualFornecedor(options);
    this.download(`relatorio-fornecedores-individual-${fornecedor.nif}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoFornecedores(options: RelatorioFornecedoresOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasFornecedores(options.fornecedores, startY);
    currentY = this.addRelatorioExecutivoFornecedores(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoFornecedores(options: RelatorioFornecedoresOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosFornecedores(options.filtros, startY);
    currentY = this.addRelatorioFiltradoFornecedores(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoFornecedores(options: RelatorioFornecedoresOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoFornecedores(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualFornecedor(options: RelatorioFornecedoresOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualFornecedor(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualFornecedor(options: RelatorioFornecedoresOptions, startY: number): number {
    const fornecedor = options.fornecedores[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(59, 130, 246); // Azul
    this.doc.rect(15, startY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica do Fornecedor', 20, startY + 2);
    
    // KPIs alinhados: Estado, Data Registo, NIF
    const estadoColors = {
      'ativo': [34, 197, 94], // Verde
      'inativo': [239, 68, 68] // Vermelho
    };
    
    const estadoColor = estadoColors[fornecedor.estado] || [107, 114, 128];
    const estadoText = this.getEstadoTextFornecedor(fornecedor.estado);
    
    // KPIs: 3 cards, espaçados
    const kpiY = startY + 12;
    this.addKPICard(20, kpiY, 'Estado', estadoText, estadoColor);
    this.addKPICard(85, kpiY, 'Data Registo', new Date(fornecedor.data_registo).toLocaleDateString('pt-PT'), [59, 130, 246]);
    this.addKPICard(150, kpiY, 'NIF', fornecedor.nif, [251, 146, 60]);
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 30;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 50, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const infoStartY = infoY + 8;
    this.doc.text(`Nome: ${fornecedor.nome}`, 20, infoStartY);
    this.doc.text(`Email: ${fornecedor.email}`, 20, infoStartY + 6);
    this.doc.text(`Telefone: ${fornecedor.telefone}`, 20, infoStartY + 12);
    this.doc.text(`Contacto: ${fornecedor.contacto}`, 20, infoStartY + 18);
    this.doc.text(`Morada: ${fornecedor.morada}`, 20, infoStartY + 24);
    
    return infoY + 60;
  }

  private calcularEstatisticasFornecedores(fornecedores: Fornecedor[]) {
    const total = fornecedores.length;
    const ativos = fornecedores.filter(f => f.estado === 'ativo').length;
    const inativos = fornecedores.filter(f => f.estado === 'inativo').length;
    const percentualAtivos = total > 0 ? Math.round((ativos / total) * 100) : 0;
    
    // Análise por período de registo
    const agora = new Date();
    const ultimos30Dias = fornecedores.filter(f => {
      const dataRegisto = new Date(f.data_registo);
      const diffDias = Math.floor((agora.getTime() - dataRegisto.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias <= 30;
    }).length;
    
    const ultimos90Dias = fornecedores.filter(f => {
      const dataRegisto = new Date(f.data_registo);
      const diffDias = Math.floor((agora.getTime() - dataRegisto.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias <= 90;
    }).length;
    
    return {
      total,
      ativos,
      inativos,
      percentualAtivos,
      ultimos30Dias,
      ultimos90Dias
    };
  }

  private addEstatisticasFornecedores(fornecedores: Fornecedor[], startY: number): number {
    const stats = this.calcularEstatisticasFornecedores(fornecedores);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais', 20, startY);
    
    // KPIs em 2 linhas
    const kpiY = startY + 15;
    this.addKPICard(20, kpiY, 'Total', stats.total.toString(), [59, 130, 246]);
    this.addKPICard(65, kpiY, 'Ativos', stats.ativos.toString(), [34, 197, 94]);
    this.addKPICard(110, kpiY, 'Inativos', stats.inativos.toString(), [239, 68, 68]);
    this.addKPICard(155, kpiY, '% Ativos', `${stats.percentualAtivos}%`, [251, 146, 60]);
    
    const kpiY2 = kpiY + 25;
    this.addKPICard(20, kpiY2, 'Últimos 30 dias', stats.ultimos30Dias.toString(), [168, 85, 247]);
    this.addKPICard(85, kpiY2, 'Últimos 90 dias', stats.ultimos90Dias.toString(), [16, 185, 129]);
    
    return kpiY2 + 35;
  }

  private addRelatorioExecutivoFornecedores(options: RelatorioFornecedoresOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Executiva', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasFornecedores(options.fornecedores);
    const resumo = [
      `O sistema de gestão de fornecedores conta atualmente com ${stats.total} fornecedores registados.`,
      `Deste total, ${stats.ativos} estão ativos (${stats.percentualAtivos}%) e ${stats.inativos} inativos.`,
      `Nos últimos 30 dias foram registados ${stats.ultimos30Dias} novos fornecedores.`,
      `A base de fornecedores demonstra uma gestão ativa e diversificada.`
    ];
    
    let currentY = startY + 10;
    resumo.forEach(paragrafo => {
      const linhas = this.doc.splitTextToSize(paragrafo, 170);
      this.doc.text(linhas, 20, currentY);
      currentY += linhas.length * 5 + 3;
    });
    
    // Tabela dos fornecedores mais recentes
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Fornecedores Mais Recentes', 20, currentY);
    
    const fornecedoresRecentes = options.fornecedores
      .sort((a, b) => new Date(b.data_registo).getTime() - new Date(a.data_registo).getTime())
      .slice(0, 5);
    
    const tableData = fornecedoresRecentes.map(f => [
      f.nome,
      f.nif,
      this.getEstadoTextFornecedor(f.estado),
      new Date(f.data_registo).toLocaleDateString('pt-PT')
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 5,
      head: [['Nome', 'NIF', 'Estado', 'Data Registo']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: 20, right: 20 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addFiltrosFornecedores(filtros: any, startY: number): number {
    if (!filtros || Object.keys(filtros).length === 0) {
      return startY;
    }
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    // Lista de filtros
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    let currentY = startY + 10;
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        const label = this.getFilterLabelFornecedor(key);
        const text = `${label}: ${value}`;
        this.doc.text(text, 20, currentY);
        currentY += 6;
      }
    });
    
    return currentY + 5;
  }

  private addRelatorioFiltradoFornecedores(options: RelatorioFornecedoresOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resultados Filtrados', 20, startY);
    
    // Tabela com todos os fornecedores filtrados
    const tableData = options.fornecedores.map(f => [
      f.nome,
      f.nif,
      f.email,
      f.telefone,
      this.getEstadoTextFornecedor(f.estado),
      new Date(f.data_registo).toLocaleDateString('pt-PT')
    ]);
    
    autoTable(this.doc, {
      startY: startY + 5,
      head: [['Nome', 'NIF', 'Email', 'Telefone', 'Estado', 'Data Registo']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      margin: { left: 20, right: 20 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addRelatorioComparativoFornecedores(options: RelatorioFornecedoresOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    // Estatísticas comparativas
    const stats = this.calcularEstatisticasFornecedores(options.fornecedores);
    
    // Gráfico de pizza para estado dos fornecedores
    const chartY = startY + 15;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Estado', 20, chartY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    // Legenda do gráfico
    const legendY = chartY + 10;
    this.doc.setFillColor(34, 197, 94); // Verde
    this.doc.rect(20, legendY - 2, 8, 8, 'F');
    this.doc.text(`Ativos: ${stats.ativos} (${stats.percentualAtivos}%)`, 35, legendY + 3);
    
    this.doc.setFillColor(239, 68, 68); // Vermelho
    this.doc.rect(20, legendY + 8, 8, 8, 'F');
    this.doc.text(`Inativos: ${stats.inativos} (${100 - stats.percentualAtivos}%)`, 35, legendY + 13);
    
    // Análise temporal
    const temporalY = legendY + 25;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Temporal', 20, temporalY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    this.doc.text(`Fornecedores registados nos últimos 30 dias: ${stats.ultimos30Dias}`, 20, temporalY + 8);
    this.doc.text(`Fornecedores registados nos últimos 90 dias: ${stats.ultimos90Dias}`, 20, temporalY + 16);
    
    // Tabela comparativa
    const tableY = temporalY + 30;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Top 10 Fornecedores por Data de Registo', 20, tableY);
    
    const fornecedoresOrdenados = options.fornecedores
      .sort((a, b) => new Date(b.data_registo).getTime() - new Date(a.data_registo).getTime())
      .slice(0, 10);
    
    const tableData = fornecedoresOrdenados.map((f, index) => [
      (index + 1).toString(),
      f.nome,
      f.nif,
      this.getEstadoTextFornecedor(f.estado),
      new Date(f.data_registo).toLocaleDateString('pt-PT')
    ]);
    
    autoTable(this.doc, {
      startY: tableY + 5,
      head: [['#', 'Nome', 'NIF', 'Estado', 'Data Registo']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: 20, right: 20 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private getFilterLabelFornecedor(key: string): string {
    const labels: Record<string, string> = {
      search: 'Pesquisa',
      estado: 'Estado',
      dataInicio: 'Data Início',
      dataFim: 'Data Fim'
    };
    return labels[key] || key;
  }

  private getEstadoTextFornecedor(estado: string): string {
    const estadoMap: Record<string, string> = {
      'ativo': 'Ativo',
      'inativo': 'Inativo'
    };
    return estadoMap[estado] || estado;
  }

  // Métodos para Relatórios de Não Conformidades
  public async generateNaoConformidadesExecutiveReport(naoConformidades: NaoConformidade[]): Promise<void> {
    const options: RelatorioNaoConformidadesOptions = {
      titulo: 'Relatório Executivo de Não Conformidades',
      subtitulo: 'Visão Geral e Indicadores de Performance',
      naoConformidades,
      tipo: 'executivo'
    };
    this.gerarRelatorioExecutivoNaoConformidades(options);
    this.download(`relatorio-nao-conformidades-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateNaoConformidadesFilteredReport(naoConformidades: NaoConformidade[], filtros: any): Promise<void> {
    const options: RelatorioNaoConformidadesOptions = {
      titulo: 'Relatório Filtrado de Não Conformidades',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      naoConformidades,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoNaoConformidades(options);
    this.download(`relatorio-nao-conformidades-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateNaoConformidadesComparativeReport(naoConformidades: NaoConformidade[]): Promise<void> {
    const options: RelatorioNaoConformidadesOptions = {
      titulo: 'Relatório Comparativo de Não Conformidades',
      subtitulo: 'Análise Comparativa e Benchmarks',
      naoConformidades,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoNaoConformidades(options);
    this.download(`relatorio-nao-conformidades-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateNaoConformidadesIndividualReport(naoConformidades: NaoConformidade[]): Promise<void> {
    if (naoConformidades.length !== 1) {
      throw new Error('Relatório individual deve conter apenas uma não conformidade');
    }
    
    const nc = naoConformidades[0];
    const options: RelatorioNaoConformidadesOptions = {
      titulo: `Relatório Individual - ${nc.codigo}`,
      subtitulo: `Tipo: ${this.getTipoTextNC(nc.tipo)} | Severidade: ${this.getSeveridadeTextNC(nc.severidade)}`,
      naoConformidades,
      tipo: 'individual'
    };
    this.gerarRelatorioIndividualNaoConformidade(options);
    this.download(`relatorio-nao-conformidades-individual-${nc.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoNaoConformidades(options: RelatorioNaoConformidadesOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasNaoConformidades(options.naoConformidades, startY);
    currentY = this.addRelatorioExecutivoNaoConformidades(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoNaoConformidades(options: RelatorioNaoConformidadesOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosNaoConformidades(options.filtros, startY);
    currentY = this.addRelatorioFiltradoNaoConformidades(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoNaoConformidades(options: RelatorioNaoConformidadesOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoNaoConformidades(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualNaoConformidade(options: RelatorioNaoConformidadesOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualNaoConformidade(options, startY);
    
    this.addProfessionalFooter();
  }

  private addRelatorioIndividualNaoConformidade(options: RelatorioNaoConformidadesOptions, startY: number): number {
    const nc = options.naoConformidades[0];
    
    // Título da seção com fundo colorido
    this.doc.setFillColor(239, 68, 68); // Vermelho
    this.doc.rect(15, startY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Não Conformidade', 20, startY + 2);
    
    // KPIs alinhados: Status, Severidade, Impacto, Custo
    const statusColors = {
      'pendente': [245, 158, 11], // Amarelo
      'em_analise': [99, 102, 241], // Índigo
      'aprovado': [34, 197, 94], // Verde
      'reprovado': [239, 68, 68], // Vermelho
      'concluido': [16, 185, 129] // Verde escuro
    };
    
    const statusColor = statusColors[nc.estado] || [107, 114, 128];
    const statusText = this.getStatusTextNC(nc.estado);
    
    const severidadeColors = {
      'baixa': [34, 197, 94], // Verde
      'media': [245, 158, 11], // Amarelo
      'alta': [251, 146, 60], // Laranja
      'critica': [239, 68, 68] // Vermelho
    };
    
    const severidadeColor = severidadeColors[nc.severidade] || [107, 114, 128];
    const severidadeText = this.getSeveridadeTextNC(nc.severidade);
    
    // KPIs: 4 cards, espaçados
    const kpiY = startY + 12;
    this.addKPICard(20, kpiY, 'Status', statusText, statusColor);
    this.addKPICard(65, kpiY, 'Severidade', severidadeText, severidadeColor);
    this.addKPICard(110, kpiY, 'Impacto', this.getImpactoTextNC(nc.impacto), [59, 130, 246]);
    this.addKPICard(155, kpiY, 'Custo', nc.custo_real ? `€${nc.custo_real}` : 'N/A', [251, 146, 60]);
    
    // Informações básicas - sem bordas, apenas fundo colorido
    const infoY = kpiY + 30;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 50, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const infoStartY = infoY + 8;
    this.doc.text(`Código: ${nc.codigo}`, 20, infoStartY);
    this.doc.text(`Tipo: ${this.getTipoTextNC(nc.tipo)}`, 20, infoStartY + 6);
    this.doc.text(`Categoria: ${this.getCategoriaTextNC(nc.categoria)}`, 20, infoStartY + 12);
    this.doc.text(`Área Afetada: ${nc.area_afetada}`, 20, infoStartY + 18);
    this.doc.text(`Responsável Detecção: ${nc.responsavel_deteccao}`, 20, infoStartY + 24);
    
    // Datas importantes
    const datasY = infoY + 60;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, datasY - 5, 180, 40, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Datas Importantes', 20, datasY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const datasStartY = datasY + 8;
    this.doc.text(`Data Detecção: ${new Date(nc.data_deteccao).toLocaleDateString('pt-PT')}`, 20, datasStartY);
    if (nc.data_resolucao) {
      this.doc.text(`Data Resolução: ${new Date(nc.data_resolucao).toLocaleDateString('pt-PT')}`, 20, datasStartY + 6);
    }
    if (nc.data_limite_resolucao) {
      this.doc.text(`Data Limite: ${new Date(nc.data_limite_resolucao).toLocaleDateString('pt-PT')}`, 20, datasStartY + 12);
    }
    if (nc.data_verificacao_eficacia) {
      this.doc.text(`Verificação Eficácia: ${new Date(nc.data_verificacao_eficacia).toLocaleDateString('pt-PT')}`, 20, datasStartY + 18);
    }
    
    // Descrição
    const descricaoY = datasY + 50;
    this.doc.setFillColor(240, 249, 255); // Azul claro
    this.doc.rect(15, descricaoY - 5, 180, 35, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Descrição', 20, descricaoY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const descricao = this.doc.splitTextToSize(nc.descricao, 170);
    this.doc.text(descricao, 20, descricaoY + 8);
    
    // Ações (se existirem)
    const acoesY = descricaoY + 40;
    if (nc.acao_corretiva || nc.acao_preventiva) {
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, acoesY - 5, 180, 30, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Ações Implementadas', 20, acoesY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      
      if (nc.acao_corretiva) {
        this.doc.text('Ação Corretiva:', 20, acoesY + 8);
        const acaoCorretiva = this.doc.splitTextToSize(nc.acao_corretiva, 160);
        this.doc.text(acaoCorretiva, 25, acoesY + 14);
      }
      
      if (nc.acao_preventiva) {
        this.doc.text('Ação Preventiva:', 20, acoesY + 20);
        const acaoPreventiva = this.doc.splitTextToSize(nc.acao_preventiva, 160);
        this.doc.text(acaoPreventiva, 25, acoesY + 26);
      }
      
      return acoesY + 40;
    }
    
    return acoesY;
  }

  private calcularEstatisticasNaoConformidades(naoConformidades: NaoConformidade[]) {
    const total = naoConformidades.length;
    const pendentes = naoConformidades.filter(nc => !nc.data_resolucao).length;
    const resolvidas = naoConformidades.filter(nc => nc.data_resolucao).length;
    const percentualResolucao = total > 0 ? Math.round((resolvidas / total) * 100) : 0;
    
    // Análise por severidade
    const porSeveridade = {
      baixa: naoConformidades.filter(nc => nc.severidade === 'baixa').length,
      media: naoConformidades.filter(nc => nc.severidade === 'media').length,
      alta: naoConformidades.filter(nc => nc.severidade === 'alta').length,
      critica: naoConformidades.filter(nc => nc.severidade === 'critica').length
    };
    
    // Análise por tipo
    const porTipo = naoConformidades.reduce((acc, nc) => {
      acc[nc.tipo] = (acc[nc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Custo total
    const custoTotal = naoConformidades.reduce((total, nc) => {
      return total + (nc.custo_real || 0);
    }, 0);
    
    // Tempo médio de resolução
    const ncsComResolucao = naoConformidades.filter(nc => nc.data_resolucao && nc.data_deteccao);
    const tempoMedioResolucao = ncsComResolucao.length > 0 
      ? ncsComResolucao.reduce((total, nc) => {
          const deteccao = new Date(nc.data_deteccao);
          const resolucao = new Date(nc.data_resolucao!);
          return total + Math.floor((resolucao.getTime() - deteccao.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / ncsComResolucao.length
      : 0;
    
    return {
      total,
      pendentes,
      resolvidas,
      percentualResolucao,
      porSeveridade,
      porTipo,
      custoTotal,
      tempoMedioResolucao
    };
  }

  private addEstatisticasNaoConformidades(naoConformidades: NaoConformidade[], startY: number): number {
    const stats = this.calcularEstatisticasNaoConformidades(naoConformidades);
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais', 20, startY);
    
    // KPIs em 2 linhas
    const kpiY = startY + 15;
    this.addKPICard(20, kpiY, 'Total', stats.total.toString(), [239, 68, 68]);
    this.addKPICard(65, kpiY, 'Pendentes', stats.pendentes.toString(), [245, 158, 11]);
    this.addKPICard(110, kpiY, 'Resolvidas', stats.resolvidas.toString(), [34, 197, 94]);
    this.addKPICard(155, kpiY, '% Resolução', `${stats.percentualResolucao}%`, [59, 130, 246]);
    
    const kpiY2 = kpiY + 25;
    this.addKPICard(20, kpiY2, 'Custo Total', `€${stats.custoTotal.toLocaleString()}`, [251, 146, 60]);
    this.addKPICard(85, kpiY2, 'Tempo Médio', `${Math.round(stats.tempoMedioResolucao)} dias`, [168, 85, 247]);
    
    return kpiY2 + 35;
  }

  private addRelatorioExecutivoNaoConformidades(options: RelatorioNaoConformidadesOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Executiva', 20, startY);
    
    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    const stats = this.calcularEstatisticasNaoConformidades(options.naoConformidades);
    const resumo = [
      `O sistema de gestão de não conformidades registou ${stats.total} ocorrências no período analisado.`,
      `Deste total, ${stats.resolvidas} foram resolvidas (${stats.percentualResolucao}%) e ${stats.pendentes} estão pendentes.`,
      `O custo total associado às não conformidades foi de €${stats.custoTotal.toLocaleString()}.`,
      `O tempo médio de resolução foi de ${Math.round(stats.tempoMedioResolucao)} dias.`
    ];
    
    let currentY = startY + 10;
    resumo.forEach(paragrafo => {
      const linhas = this.doc.splitTextToSize(paragrafo, 170);
      this.doc.text(linhas, 20, currentY);
      currentY += linhas.length * 5 + 3;
    });
    
    // Tabela das NCs mais críticas
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Não Conformidades Mais Críticas', 20, currentY);
    
    const ncsCriticas = options.naoConformidades
      .filter(nc => nc.severidade === 'critica' || nc.severidade === 'alta')
      .sort((a, b) => {
        if (a.severidade === 'critica' && b.severidade !== 'critica') return -1;
        if (b.severidade === 'critica' && a.severidade !== 'critica') return 1;
        return new Date(b.data_deteccao).getTime() - new Date(a.data_deteccao).getTime();
      })
      .slice(0, 5);
    
    const tableData = ncsCriticas.map(nc => [
      nc.codigo,
      this.getTipoTextNC(nc.tipo),
      this.getSeveridadeTextNC(nc.severidade),
      new Date(nc.data_deteccao).toLocaleDateString('pt-PT'),
      nc.data_resolucao ? 'Resolvida' : 'Pendente'
    ]);
    
    autoTable(this.doc, {
      startY: currentY + 5,
      head: [['Código', 'Tipo', 'Severidade', 'Data Detecção', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: 20, right: 20 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addFiltrosNaoConformidades(filtros: any, startY: number): number {
    if (!filtros || Object.keys(filtros).length === 0) {
      return startY;
    }
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    // Lista de filtros
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    let currentY = startY + 10;
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && value !== '') {
        const label = this.getFilterLabelNaoConformidade(key);
        const text = `${label}: ${value}`;
        this.doc.text(text, 20, currentY);
        currentY += 6;
      }
    });
    
    return currentY + 5;
  }

  private addRelatorioFiltradoNaoConformidades(options: RelatorioNaoConformidadesOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resultados Filtrados', 20, startY);
    
    // Tabela com todas as NCs filtradas
    const tableData = options.naoConformidades.map(nc => [
      nc.codigo,
      this.getTipoTextNC(nc.tipo),
      this.getSeveridadeTextNC(nc.severidade),
      this.getStatusTextNC(nc.estado),
      new Date(nc.data_deteccao).toLocaleDateString('pt-PT'),
      nc.custo_real ? `€${nc.custo_real}` : 'N/A'
    ]);
    
    autoTable(this.doc, {
      startY: startY + 5,
      head: [['Código', 'Tipo', 'Severidade', 'Status', 'Data Detecção', 'Custo']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      margin: { left: 20, right: 20 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addRelatorioComparativoNaoConformidades(options: RelatorioNaoConformidadesOptions, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    // Estatísticas comparativas
    const stats = this.calcularEstatisticasNaoConformidades(options.naoConformidades);
    
    // Gráfico de pizza para severidade
    const chartY = startY + 15;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Severidade', 20, chartY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    
    // Legenda do gráfico
    const legendY = chartY + 10;
    this.doc.setFillColor(34, 197, 94); // Verde
    this.doc.rect(20, legendY - 2, 8, 8, 'F');
    this.doc.text(`Baixa: ${stats.porSeveridade.baixa}`, 35, legendY + 3);
    
    this.doc.setFillColor(245, 158, 11); // Amarelo
    this.doc.rect(20, legendY + 8, 8, 8, 'F');
    this.doc.text(`Média: ${stats.porSeveridade.media}`, 35, legendY + 13);
    
    this.doc.setFillColor(251, 146, 60); // Laranja
    this.doc.rect(20, legendY + 16, 8, 8, 'F');
    this.doc.text(`Alta: ${stats.porSeveridade.alta}`, 35, legendY + 21);
    
    this.doc.setFillColor(239, 68, 68); // Vermelho
    this.doc.rect(20, legendY + 24, 8, 8, 'F');
    this.doc.text(`Crítica: ${stats.porSeveridade.critica}`, 35, legendY + 29);
    
    // Análise por tipo
    const tipoY = legendY + 40;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Distribuição por Tipo', 20, tipoY);
    
    const tableDataTipo = Object.entries(stats.porTipo).map(([tipo, quantidade]) => [
      this.getTipoTextNC(tipo),
      quantidade.toString(),
      `${((quantidade / stats.total) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: tipoY + 5,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableDataTipo,
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: 20, right: 20 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private getFilterLabelNaoConformidade(key: string): string {
    const labels: Record<string, string> = {
      search: 'Pesquisa',
      tipo: 'Tipo',
      severidade: 'Severidade',
      categoria: 'Categoria',
      status: 'Status',
      dataInicio: 'Data Início',
      dataFim: 'Data Fim'
    };
    return labels[key] || key;
  }

  private getStatusTextNC(status: string): string {
    const statusMap: Record<string, string> = {
      'pendente': 'Pendente',
      'em_analise': 'Em Análise',
      'aprovado': 'Aprovado',
      'reprovado': 'Reprovado',
      'concluido': 'Concluído'
    };
    return statusMap[status] || status;
  }

  private getSeveridadeTextNC(severidade: string): string {
    const severidadeMap: Record<string, string> = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta',
      'critica': 'Crítica'
    };
    return severidadeMap[severidade] || severidade;
  }

  private getTipoTextNC(tipo: string): string {
    const tipoMap: Record<string, string> = {
      'material': 'Material',
      'execucao': 'Execução',
      'documentacao': 'Documentação',
      'seguranca': 'Segurança',
      'ambiente': 'Ambiente',
      'qualidade': 'Qualidade',
      'prazo': 'Prazo',
      'custo': 'Custo',
      'outro': 'Outro'
    };
    return tipoMap[tipo] || tipo;
  }

  private getCategoriaTextNC(categoria: string): string {
    const categoriaMap: Record<string, string> = {
      'auditoria': 'Auditoria',
      'inspecao': 'Inspeção',
      'reclamacao': 'Reclamação',
      'acidente': 'Acidente',
      'incidente': 'Incidente',
      'desvio': 'Desvio',
      'outro': 'Outro'
    };
    return categoriaMap[categoria] || categoria;
  }

  private getImpactoTextNC(impacto: string): string {
    const impactoMap: Record<string, string> = {
      'baixo': 'Baixo',
      'medio': 'Médio',
      'alto': 'Alto',
      'critico': 'Crítico'
    };
    return impactoMap[impacto] || impacto;
  }

  static async generatePIEReport(data: PIEReportData, tipo: 'executivo' | 'individual' | 'filtrado' = 'individual'): Promise<string> {
    console.log('PDFService: Iniciando geração do relatório PIE - Tipo:', tipo);
    console.log('PDFService: Dados recebidos:', data);
    
    try {
      const doc = new jsPDF();
      
      if (tipo === 'individual') {
        return this.generatePIEReportIndividual(doc, data);
      } else if (tipo === 'executivo') {
        return this.generatePIEReportExecutivo(doc, data);
      } else {
        return this.generatePIEReportFiltrado(doc, data);
      }
    } catch (error) {
      console.error('PDFService: Erro ao gerar relatório PIE:', error);
      throw error;
    }
  }

  private static generatePIEReportIndividual(doc: jsPDF, data: PIEReportData): string {
    let yPosition = 20;
    
    // Cabeçalho profissional
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Individual PIE', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Plano de Inspeção e Ensaios - Ficha Técnica Detalhada', 20, 35);
    
    // Informações do PIE em cards visuais
    yPosition = 60;
    this.addInfoCard(doc, 'Código', data.pie.codigo, 20, yPosition);
    this.addInfoCard(doc, 'Título', data.pie.titulo, 110, yPosition);
    
    yPosition += 45;
    this.addInfoCard(doc, 'Status', this.formatStatus(data.pie.status), 20, yPosition);
    this.addInfoCard(doc, 'Prioridade', this.formatPriority(data.pie.prioridade), 110, yPosition);
    
    yPosition += 45;
    this.addInfoCard(doc, 'Responsável', data.pie.responsavel || 'Não definido', 20, yPosition);
    this.addInfoCard(doc, 'Zona', data.pie.zona || 'Não definida', 110, yPosition);
    
    yPosition += 45;
    this.addInfoCard(doc, 'Data Início', data.datas?.inicio ? this.formatDate(data.datas.inicio) : this.formatDate(data.pie.created_at), 20, yPosition);
    this.addInfoCard(doc, 'Data Planeada', data.pie.data_planeada ? this.formatDate(data.pie.data_planeada) : 'Não definida', 110, yPosition);
    
    // Estatísticas com gráficos visuais
    yPosition += 80;
    this.addStatisticsSection(doc, data.estatisticas, yPosition);
    
    // Seções e Pontos detalhados
    yPosition += 100;
    data.secoes.forEach((secao, secaoIndex) => {
      yPosition = this.addSectionDetails(doc, secao, yPosition);
    });
    
    // Seção de assinaturas
    yPosition = this.addSignatureSection(doc, data, yPosition);
    
    // Rodapé profissional
    this.addProfessionalFooter(doc);
    
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  }

  private static generatePIEReportExecutivo(doc: jsPDF, data: PIEReportData): string {
    let yPosition = 20;
    
    // Cabeçalho executivo
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Executivo PIE', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Visão Geral e Indicadores de Performance', 20, 35);
    
    // Resumo executivo
    yPosition = 60;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Executivo', 20, yPosition);
    
    yPosition += 20;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`O PIE "${data.pie.titulo}" (${data.pie.codigo}) apresenta um progresso de ${data.estatisticas.percentagemConclusao}% de conclusão.`, 20, yPosition);
    yPosition += 15;
    doc.text(`Com ${data.estatisticas.totalPontos} pontos de inspeção, ${data.estatisticas.pontosConformes} estão conformes e ${data.estatisticas.pontosNaoConformes} não conformes.`, 20, yPosition);
    
    // Informações de datas
    yPosition += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Cronologia:', 20, yPosition);
    yPosition += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(`Início: ${data.datas?.inicio ? this.formatDate(data.datas.inicio) : this.formatDate(data.pie.created_at)}`, 25, yPosition);
    yPosition += 10;
    if (data.datas?.fim) {
      doc.text(`Finalização: ${this.formatDate(data.datas.fim)}`, 25, yPosition);
      yPosition += 10;
    }
    if (data.datas?.aprovacao) {
      doc.text(`Aprovação: ${this.formatDate(data.datas.aprovacao)}`, 25, yPosition);
      yPosition += 10;
    }
    
    // KPIs visuais
    yPosition += 20;
    this.addKPISection(doc, data.estatisticas, yPosition);
    
    // Gráfico de progresso
    yPosition += 50;
    this.addProgressChart(doc, data.estatisticas, yPosition);
    
    // Resumo por seção
    yPosition += 40;
    this.addSectionSummary(doc, data.secoes, yPosition);
    
    // Responsáveis por tipo de inspeção
    if (data.responsaveis) {
      yPosition += 20;
      this.addResponsaveisSection(doc, data.responsaveis, yPosition);
    }
    
    this.addProfessionalFooter(doc);
    
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  }

  private static generatePIEReportFiltrado(doc: jsPDF, data: PIEReportData): string {
    let yPosition = 20;
    
    // Cabeçalho filtrado
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Filtrado PIE', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Análise com Filtros Aplicados', 20, 35);
    
    // Tabela de dados filtrados
    yPosition = 60;
    this.addFilteredDataTable(doc, data, yPosition);
    
    this.addProfessionalFooter(doc);
    
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  }

  private static addInfoCard(doc: jsPDF, label: string, value: string, x: number, y: number): void {
    const cardWidth = 85;
    const cardHeight = 25;
    
    // Fundo do card
    doc.setFillColor(248, 250, 252);
    doc.rect(x, y, cardWidth, cardHeight, 'F');
    
    // Borda
    doc.setDrawColor(226, 232, 240);
    doc.rect(x, y, cardWidth, cardHeight);
    
    // Label
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'bold');
    doc.text(label, x + 5, y + 8);
    
    // Valor - permitir texto mais longo e quebrar linhas se necessário
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    // Função para quebrar texto em múltiplas linhas
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (doc.getTextWidth(testLine) <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Palavra muito longa, quebrar
            lines.push(word.substring(0, Math.floor(maxWidth / doc.getTextWidth('a'))) + '...');
            currentLine = '';
          }
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    };
    
    const maxTextWidth = cardWidth - 10; // 5px de margem de cada lado
    const lines = wrapText(value, maxTextWidth);
    
    // Desenhar as linhas de texto
    lines.forEach((line, index) => {
      if (index < 2) { // Máximo 2 linhas para não sair do card
        doc.text(line, x + 5, y + 16 + (index * 6));
      }
    });
  }

  private static addStatisticsSection(doc: jsPDF, stats: any, startY: number): number {
    let yPosition = startY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Estatísticas de Progresso', 20, yPosition);
    
    yPosition += 40;
    
    // Cards de estatísticas
    const statsData = [
      { label: 'Total', value: stats.totalPontos, color: [59, 130, 246] },
      { label: 'Preenchidos', value: stats.pontosPreenchidos, color: [34, 197, 94] },
      { label: 'Conformes', value: stats.pontosConformes, color: [34, 197, 94] },
      { label: 'Não Conformes', value: stats.pontosNaoConformes, color: [239, 68, 68] },
      { label: 'N/A', value: stats.pontosNA, color: [245, 158, 11] },
      { label: 'Conclusão', value: `${stats.percentagemConclusao}%`, color: [59, 130, 246] }
    ];
    
    statsData.forEach((stat, index) => {
      const x = 20 + (index % 3) * 70;
      const y = yPosition + Math.floor(index / 3) * 45;
      
      // Fundo colorido
      doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      doc.rect(x, y, 60, 35, 'F');
      
      // Valor
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value.toString(), x + 30, y + 15, { align: 'center' });
      
      // Label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(stat.label, x + 30, y + 28, { align: 'center' });
    });
    
    return yPosition + 95;
  }

  private static addSectionDetails(doc: jsPDF, secao: any, startY: number): number {
    let yPosition = startY;
    
    // Verificar se precisa de nova página
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Cabeçalho da seção
    doc.setFillColor(248, 250, 252);
    doc.rect(20, yPosition - 5, doc.internal.pageSize.width - 40, 15, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${secao.codigo} - ${secao.nome}`, 25, yPosition + 5);
    
    yPosition += 35;
    
    if (secao.descricao) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      doc.text(secao.descricao, 25, yPosition);
      yPosition += 25;
    }
    
    // Pontos da seção
    secao.pontos.forEach((ponto: any) => {
      yPosition = this.addPointDetails(doc, ponto, yPosition);
    });
    
    return yPosition + 35;
  }

  private static addPointDetails(doc: jsPDF, ponto: any, startY: number): number {
    let yPosition = startY;
    
    // Verificar se precisa de nova página
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Cabeçalho do ponto
    doc.setFillColor(255, 255, 255);
    doc.rect(30, yPosition - 3, doc.internal.pageSize.width - 50, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(30, yPosition - 3, doc.internal.pageSize.width - 50, 12);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${ponto.codigo} - ${ponto.titulo}`, 35, yPosition + 3);
    
    yPosition += 25;
    
    if (ponto.descricao) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(ponto.descricao, 35, yPosition);
      yPosition += 15;
    }
    
    // Adicionar informações de data do ponto
    if (ponto.data_planeada || ponto.data_inicio || ponto.data_fim) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(75, 85, 99);
      
      const dateInfo = [];
      if (ponto.data_inicio) dateInfo.push(`Início: ${this.formatDate(ponto.data_inicio, true)}`);
      if (ponto.data_planeada) dateInfo.push(`Planeada: ${this.formatDate(ponto.data_planeada, true)}`);
      if (ponto.data_fim) dateInfo.push(`Fim: ${this.formatDate(ponto.data_fim, true)}`);
      
      doc.text(dateInfo.join(' | '), 35, yPosition);
      yPosition += 15;
    }
    
    // Resposta do ponto
    if (ponto.resposta) {
      const statusColor = ponto.resposta.conforme === true ? [34, 197, 94] : 
                         ponto.resposta.conforme === false ? [239, 68, 68] : [245, 158, 11];
      
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.rect(35, yPosition - 2, 60, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(this.getStatusText(ponto.resposta.conforme), 40, yPosition + 3);
      
      yPosition += 25;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Resposta: ${this.formatResponseValue(ponto, ponto.resposta)}`, 35, yPosition);
      yPosition += 15;
      
      if (ponto.resposta.observacoes) {
        doc.text(`Observações: ${ponto.resposta.observacoes}`, 35, yPosition);
        yPosition += 15;
      }
      
      if (ponto.resposta.responsavel) {
        doc.text(`Responsável: ${ponto.resposta.responsavel}`, 35, yPosition);
        yPosition += 15;
      }
      
      // Adicionar data da resposta
      if (ponto.resposta.data_resposta) {
        doc.text(`Data Resposta: ${this.formatDate(ponto.resposta.data_resposta, true)}`, 35, yPosition);
        yPosition += 15;
      }
    } else {
      doc.setFillColor(156, 163, 175);
      doc.rect(35, yPosition - 2, 50, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Pendente', 40, yPosition + 3);
      yPosition += 25;
    }
    
    return yPosition + 15;
  }

  private static addKPISection(doc: jsPDF, stats: any, startY: number): number {
    let yPosition = startY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Indicadores de Performance (KPIs)', 20, yPosition);
    
    yPosition += 25;
    
    const kpis = [
      { label: 'Taxa de Conformidade', value: `${Math.round((stats.pontosConformes / stats.totalPontos) * 100)}%`, color: [34, 197, 94] },
      { label: 'Taxa de Não Conformidade', value: `${Math.round((stats.pontosNaoConformes / stats.totalPontos) * 100)}%`, color: [239, 68, 68] },
      { label: 'Progresso Geral', value: `${stats.percentagemConclusao}%`, color: [59, 130, 246] }
    ];
    
    kpis.forEach((kpi, index) => {
      const x = 20 + index * 65;
      
      // Fundo do KPI
      doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
      doc.rect(x, yPosition, 55, 35, 'F');
      
      // Valor
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(kpi.value, x + 27.5, yPosition + 18, { align: 'center' });
      
      // Label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(kpi.label, x + 27.5, yPosition + 28, { align: 'center' });
    });
    
    return yPosition + 45;
  }

  private static addProgressChart(doc: jsPDF, stats: any, startY: number): number {
    let yPosition = startY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Gráfico de Progresso', 20, yPosition);
    
    yPosition += 25;
    
    // Barra de progresso
    const barWidth = 150;
    const barHeight = 18;
    const progressWidth = (stats.percentagemConclusao / 100) * barWidth;
    
    // Fundo da barra
    doc.setFillColor(226, 232, 240);
    doc.rect(20, yPosition, barWidth, barHeight, 'F');
    
    // Progresso
    doc.setFillColor(34, 197, 94);
    doc.rect(20, yPosition, progressWidth, barHeight, 'F');
    
    // Borda
    doc.setDrawColor(156, 163, 175);
    doc.rect(20, yPosition, barWidth, barHeight);
    
    // Texto da porcentagem
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${stats.percentagemConclusao}%`, 20 + barWidth + 15, yPosition + 12);
    
    return yPosition + 35;
  }

  private static addSectionSummary(doc: jsPDF, secoes: any[], startY: number): number {
    let yPosition = startY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo por Seção', 20, yPosition);
    
    yPosition += 25;
    
    secoes.forEach((secao, index) => {
      const pontosConformes = secao.pontos.filter((p: any) => p.resposta?.conforme === true).length;
      const pontosNaoConformes = secao.pontos.filter((p: any) => p.resposta?.conforme === false).length;
      const pontosPendentes = secao.pontos.filter((p: any) => !p.resposta).length;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${secao.codigo} - ${secao.nome}`, 20, yPosition);
      
      yPosition += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Conformes: ${pontosConformes} | Não Conformes: ${pontosNaoConformes} | Pendentes: ${pontosPendentes}`, 25, yPosition);
      
      yPosition += 20;
    });
    
    return yPosition;
  }

  private static addFilteredDataTable(doc: jsPDF, data: PIEReportData, startY: number): number {
    let yPosition = startY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados Filtrados', 20, yPosition);
    
    yPosition += 20;
    
    // Mostrar filtros aplicados
    if (data.filters) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Filtros Aplicados:', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      
      const activeFilters = [];
      if (data.filters.status) activeFilters.push(`Status: ${this.formatStatus(data.filters.status)}`);
      if (data.filters.prioridade) activeFilters.push(`Prioridade: ${this.formatPriority(data.filters.prioridade)}`);
      if (data.filters.responsavel) activeFilters.push(`Responsável: ${data.filters.responsavel}`);
      if (data.filters.zona) activeFilters.push(`Zona: ${data.filters.zona}`);
      if (data.filters.dataInicio) activeFilters.push(`Data Início: ${this.formatDate(data.filters.dataInicio)}`);
      if (data.filters.dataFim) activeFilters.push(`Data Fim: ${this.formatDate(data.filters.dataFim)}`);
      
      if (activeFilters.length > 0) {
        doc.text(activeFilters.join(' | '), 20, yPosition);
        yPosition += 20;
      } else {
        doc.text('Nenhum filtro específico aplicado', 20, yPosition);
        yPosition += 20;
      }
    }
    
    // Cabeçalho da tabela
    const headers = ['Código', 'Título', 'Status', 'Progresso', 'Conformidade'];
    const colWidths = [30, 60, 25, 25, 25];
    let x = 20;
    
    doc.setFillColor(248, 250, 252);
    doc.rect(x, yPosition - 5, colWidths.reduce((a, b) => a + b, 0), 12, 'F');
    
    headers.forEach((header, index) => {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(header, x + 5, yPosition + 2);
      x += colWidths[index];
    });
    
    yPosition += 15;
    
    // Dados da tabela
    const conformidade = Math.round((data.estatisticas.pontosConformes / data.estatisticas.totalPontos) * 100);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(data.pie.codigo, 25, yPosition);
    doc.text(data.pie.titulo.substring(0, 20) + (data.pie.titulo.length > 20 ? '...' : ''), 55, yPosition);
    doc.text(this.formatStatus(data.pie.status), 115, yPosition);
    doc.text(`${data.estatisticas.percentagemConclusao}%`, 140, yPosition);
    doc.text(`${conformidade}%`, 165, yPosition);
    
    return yPosition + 20;
  }

  private static addProfessionalFooter(doc: jsPDF): void {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Linha separadora
      doc.setDrawColor(226, 232, 240);
      doc.line(20, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
      
      // Informações do rodapé
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Qualicore - Sistema de Gestão da Qualidade', 20, doc.internal.pageSize.height - 15);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 15);
      doc.text(`Gerado em: ${this.formatDate(new Date().toISOString(), true)}`, 20, doc.internal.pageSize.height - 10);
    }
  }

  private static addSignatureSection(doc: jsPDF, data: PIEReportData, startY: number): number {
    let yPosition = startY;
    
    // Verificar se precisa de nova página
    if (yPosition > 160) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Título da seção
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Conformidade e Assinaturas', 20, yPosition);
    
    yPosition += 40;
    
    // Linha separadora
    doc.setDrawColor(226, 232, 240);
    doc.line(20, yPosition, doc.internal.pageSize.width - 20, yPosition);
    yPosition += 35;
    
    // Data de finalização
    const dataFinalizacao = data.datas?.fim || new Date().toISOString();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Data de Finalização:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatDate(dataFinalizacao), 130, yPosition);
    
    yPosition += 40;
    
    // Área de assinaturas
    const signatureWidth = 90;
    const signatureHeight = 70;
    const spacing = 30;
    
    // Assinatura da Qualidade
    const qualidadeX = 20;
    const chefeObraX = qualidadeX + signatureWidth + spacing;
    
    // Assinatura da Qualidade
    doc.setDrawColor(156, 163, 175);
    doc.rect(qualidadeX, yPosition, signatureWidth, signatureHeight);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Responsável pela Qualidade', qualidadeX + 5, yPosition + 15);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(data.assinaturas?.qualidade?.nome || '_________________', qualidadeX + 5, yPosition + 32);
    doc.text(data.assinaturas?.qualidade?.cargo || 'Técnico de Qualidade', qualidadeX + 5, yPosition + 42);
    doc.text(data.assinaturas?.qualidade?.data ? this.formatDate(data.assinaturas.qualidade.data, true) : this.formatDate(new Date().toISOString(), true), qualidadeX + 5, yPosition + 52);
    
    // Assinatura do Chefe de Obra
    doc.setDrawColor(156, 163, 175);
    doc.rect(chefeObraX, yPosition, signatureWidth, signatureHeight);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Chefe de Obra', chefeObraX + 5, yPosition + 15);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(data.assinaturas?.chefeObra?.nome || '_________________', chefeObraX + 5, yPosition + 32);
    doc.text(data.assinaturas?.chefeObra?.cargo || 'Chefe de Obra', chefeObraX + 5, yPosition + 42);
    doc.text(data.assinaturas?.chefeObra?.data ? this.formatDate(data.assinaturas.chefeObra.data, true) : this.formatDate(new Date().toISOString(), true), chefeObraX + 5, yPosition + 52);
    
    yPosition += signatureHeight + 35;
    
    // Responsáveis por tipo de inspeção
    if (data.responsaveis) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Responsáveis por Tipo de Inspeção:', 20, yPosition);
      
      yPosition += 25;
      
      const responsaveis = [
        { label: 'Betonagem', value: data.responsaveis.betonagem },
        { label: 'Geometria', value: data.responsaveis.geometria },
        { label: 'Ensaios', value: data.responsaveis.ensaios },
        { label: 'Acabamentos', value: data.responsaveis.acabamentos },
        { label: 'Estrutural', value: data.responsaveis.estrutural }
      ];
      
      responsaveis.forEach((resp, index) => {
        if (resp.value) {
          const x = 20 + (index % 2) * 100;
          const y = yPosition + Math.floor(index / 2) * 20;
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`${resp.label}:`, x, y);
          doc.setFont('helvetica', 'normal');
          doc.text(resp.value, x + 50, y);
        }
      });
      
      yPosition += Math.ceil(responsaveis.filter(r => r.value).length / 2) * 20 + 20;
    }
    
    return yPosition;
  }

  private static addResponsaveisSection(doc: jsPDF, responsaveis: any, startY: number): number {
    let yPosition = startY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Responsáveis por Tipo de Inspeção', 20, yPosition);
    
    yPosition += 20;
    
    const responsaveisList = [
      { label: 'Betonagem', value: responsaveis.betonagem },
      { label: 'Geometria', value: responsaveis.geometria },
      { label: 'Ensaios', value: responsaveis.ensaios },
      { label: 'Acabamentos', value: responsaveis.acabamentos },
      { label: 'Estrutural', value: responsaveis.estrutural }
    ];
    
    const activeResponsaveis = responsaveisList.filter(r => r.value);
    
    if (activeResponsaveis.length > 0) {
      activeResponsaveis.forEach((resp, index) => {
        const x = 20 + (index % 2) * 90;
        const y = yPosition + Math.floor(index / 2) * 15;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${resp.label}:`, x, y);
        doc.setFont('helvetica', 'normal');
        doc.text(resp.value, x + 45, y);
      });
      
      yPosition += Math.ceil(activeResponsaveis.length / 2) * 15 + 10;
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      doc.text('Nenhum responsável específico definido', 20, yPosition);
      yPosition += 15;
    }
    
    return yPosition;
  }

  private static generateReportContent(data: PIEReportData): string {
    const { pie, secoes, estatisticas } = data;
    
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório PIE - ${pie.codigo}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .header .subtitle {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .info-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 14px;
            color: #212529;
            font-weight: 500;
        }
        .stats-section {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .stat-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        .sections-container {
            padding: 20px;
        }
        .section {
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        .section-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #495057;
            margin: 0;
        }
        .section-code {
            font-size: 14px;
            color: #6c757d;
            margin: 5px 0 0 0;
        }
        .section-description {
            font-size: 14px;
            color: #6c757d;
            margin: 5px 0 0 0;
        }
        .points-container {
            padding: 20px;
        }
        .point {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            background: white;
        }
        .point-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
        }
        .point-number {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }
        .point-title {
            font-size: 16px;
            font-weight: 600;
            color: #495057;
            margin: 0 0 0 15px;
            flex: 1;
        }
        .point-type {
            background: #e9ecef;
            color: #6c757d;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            text-transform: uppercase;
        }
        .point-description {
            font-size: 14px;
            color: #6c757d;
            margin: 10px 0;
            font-style: italic;
        }
        .point-response {
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #28a745;
        }
        .response-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .response-value {
            font-size: 14px;
            color: #212529;
            font-weight: 500;
        }
        .response-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-conforme {
            background: #d4edda;
            color: #155724;
        }
        .status-nao-conforme {
            background: #f8d7da;
            color: #721c24;
        }
        .status-na {
            background: #fff3cd;
            color: #856404;
        }
        .status-pendente {
            background: #e2e3e5;
            color: #383d41;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer-text {
            font-size: 12px;
            color: #6c757d;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .report-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>Relatório PIE</h1>
            <p class="subtitle">Plano de Inspeção e Ensaios</p>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Código</div>
                <div class="info-value">${pie.codigo}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Título</div>
                <div class="info-value">${pie.titulo}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">${this.formatStatus(pie.status)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Prioridade</div>
                <div class="info-value">${this.formatPriority(pie.prioridade)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Responsável</div>
                <div class="info-value">${pie.responsavel || 'Não definido'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Zona</div>
                <div class="info-value">${pie.zona || 'Não definida'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Data Planeada</div>
                <div class="info-value">${pie.data_planeada ? this.formatDate(pie.data_planeada) : 'Não definida'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Data de Criação</div>
                <div class="info-value">${this.formatDate(pie.created_at)}</div>
            </div>
        </div>

        <div class="stats-section">
            <h3 style="margin: 0 0 20px 0; color: #495057;">Estatísticas de Progresso</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${estatisticas.totalPontos}</div>
                    <div class="stat-label">Total de Pontos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${estatisticas.pontosPreenchidos}</div>
                    <div class="stat-label">Preenchidos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${estatisticas.pontosConformes}</div>
                    <div class="stat-label">Conformes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${estatisticas.pontosNaoConformes}</div>
                    <div class="stat-label">Não Conformes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${estatisticas.pontosNA}</div>
                    <div class="stat-label">N/A</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${estatisticas.percentagemConclusao}%</div>
                    <div class="stat-label">Conclusão</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${estatisticas.percentagemConclusao}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sections-container">
            ${secoes.map(secao => this.generateSectionHTML(secao)).join('')}
        </div>

        <div class="footer">
            <p class="footer-text">
                Relatório gerado em ${this.formatDate(new Date().toISOString())} | 
                Qualicore - Sistema de Gestão da Qualidade
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private static generateSectionHTML(secao: PIESecao & { pontos: (PIEPonto & { resposta?: PIEResposta })[] }): string {
    return `
        <div class="section">
            <div class="section-header">
                <h3 class="section-title">${secao.nome}</h3>
                <p class="section-code">${secao.codigo}</p>
                ${secao.descricao ? `<p class="section-description">${secao.descricao}</p>` : ''}
            </div>
            <div class="points-container">
                ${secao.pontos.map(ponto => this.generatePointHTML(ponto)).join('')}
            </div>
        </div>
    `;
  }

  private static generatePointHTML(ponto: PIEPonto & { resposta?: PIEResposta }): string {
    const resposta = ponto.resposta;
    const statusClass = this.getStatusClass(resposta?.conforme);
    const statusText = this.getStatusText(resposta?.conforme);
    
    return `
        <div class="point">
            <div class="point-header">
                <div class="point-number">${ponto.ordem}</div>
                <h4 class="point-title">${ponto.titulo}</h4>
                <span class="point-type">${ponto.tipo}</span>
            </div>
            ${ponto.descricao ? `<p class="point-description">${ponto.descricao}</p>` : ''}
            ${resposta ? `
                <div class="point-response">
                    <div class="response-label">Resposta</div>
                    <div class="response-value">${this.formatResponseValue(ponto, resposta)}</div>
                    <div class="response-label" style="margin-top: 10px;">Status</div>
                    <span class="response-status ${statusClass}">${statusText}</span>
                    ${resposta.observacoes ? `
                        <div class="response-label" style="margin-top: 10px;">Observações</div>
                        <div class="response-value">${resposta.observacoes}</div>
                    ` : ''}
                    ${resposta.responsavel ? `
                        <div class="response-label" style="margin-top: 10px;">Responsável</div>
                        <div class="response-value">${resposta.responsavel}</div>
                    ` : ''}
                </div>
            ` : `
                <div class="point-response">
                    <div class="response-label">Status</div>
                    <span class="response-status status-pendente">Pendente</span>
                </div>
            `}
        </div>
    `;
  }

  private static formatResponseValue(ponto: PIEPonto, resposta: PIEResposta): string {
    switch (ponto.tipo) {
      case 'checkbox':
        return resposta.valor_booleano ? 'Sim' : 'Não';
      case 'text':
        return resposta.valor || 'Não preenchido';
      case 'number':
        return resposta.valor_numerico?.toString() || 'Não preenchido';
      case 'date':
        return resposta.valor_data ? this.formatDate(resposta.valor_data) : 'Não preenchido';
      case 'select':
        return resposta.valor || 'Não selecionado';
      case 'file':
        return resposta.arquivos && resposta.arquivos.length > 0 
          ? `${resposta.arquivos.length} arquivo(s) anexado(s)`
          : 'Nenhum arquivo anexado';
      default:
        return 'Não preenchido';
    }
  }

  private static getStatusClass(conforme: boolean | null | undefined): string {
    if (conforme === true) return 'status-conforme';
    if (conforme === false) return 'status-nao-conforme';
    if (conforme === null) return 'status-na';
    return 'status-pendente';
  }

  private static getStatusText(conforme: boolean | null | undefined): string {
    if (conforme === true) return 'Conforme';
    if (conforme === false) return 'Não Conforme';
    if (conforme === null) return 'N/A';
    return 'Pendente';
  }

  private static formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private static formatPriority(priority: string): string {
    return priority.replace(/\b\w/g, l => l.toUpperCase());
  }

  private static formatDate(dateString: string, includeTime: boolean = false): string {
    try {
      const date = new Date(dateString);
      if (includeTime) {
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  static calculateStatistics(secoes: (PIESecao & { pontos: (PIEPonto & { resposta?: PIEResposta })[] })[]): {
    totalPontos: number;
    pontosPreenchidos: number;
    pontosConformes: number;
    pontosNaoConformes: number;
    pontosNA: number;
    percentagemConclusao: number;
  } {
    let totalPontos = 0;
    let pontosPreenchidos = 0;
    let pontosConformes = 0;
    let pontosNaoConformes = 0;
    let pontosNA = 0;

    secoes.forEach(secao => {
      secao.pontos.forEach(ponto => {
        totalPontos++;
        if (ponto.resposta) {
          pontosPreenchidos++;
          if (ponto.resposta.conforme === true) {
            pontosConformes++;
          } else if (ponto.resposta.conforme === false) {
            pontosNaoConformes++;
          } else if (ponto.resposta.conforme === null) {
            pontosNA++;
          }
        }
      });
    });

    const percentagemConclusao = totalPontos > 0 ? Math.round((pontosPreenchidos / totalPontos) * 100) : 0;

    return {
      totalPontos,
      pontosPreenchidos,
      pontosConformes,
      pontosNaoConformes,
      pontosNA,
      percentagemConclusao
    };
  }

  static async exportEnsaioCompactacao(ensaio: any): Promise<string> {
    const doc = new jsPDF();
    
    // Cabeçalho profissional
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Qualicore', 20, 20);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ASCH Infraestructuras y Servicios SA', 20, 28);
    doc.text('Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa', 20, 32);
    
    // Título do relatório
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Ensaio de Compactação', 20, 55);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`Ensaio: ${ensaio.numeroEnsaio}`, 20, 65);
    
    // Data de geração
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 20, 75);
    
    // Linha separadora
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 80, doc.internal.pageSize.width - 20, 80);
    
    let currentY = 100;
    
    // Informações do ensaio
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Informações do Ensaio', 20, currentY);
    currentY += 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const infoData = [
      ['Código:', ensaio.codigo],
      ['Obra:', ensaio.obra],
      ['Localização:', ensaio.localizacao],
      ['Elemento:', ensaio.elemento],
      ['Data da Amostra:', new Date(ensaio.dataAmostra).toLocaleDateString('pt-PT')],
      ['Número de Pontos:', ensaio.pontos.length.toString()],
      ['Densidade Seca Média:', `${ensaio.densidadeSecaMedia?.toFixed(3)} g/cm³`],
      ['Grau de Compactação Médio:', `${ensaio.grauCompactacaoMedio?.toFixed(1)}%`],
      ['Umidade Média:', `${ensaio.umidadeMedia?.toFixed(2)}%`]
    ];
    
    infoData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', 80, currentY);
      currentY += 8;
    });
    
    currentY += 10;
    
    // Tabela de pontos
    if (ensaio.pontos && ensaio.pontos.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Dados dos Pontos de Ensaio', 20, currentY);
      currentY += 20;
      
      const tableData = ensaio.pontos.map((ponto: any, index: number) => [
        (index + 1).toString(),
        ponto.densidadeSeca?.toFixed(3) || 'N/A',
        ponto.umidade?.toFixed(2) || 'N/A',
        ponto.grauCompactacao?.toFixed(1) || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Ponto', 'Densidade Seca (g/cm³)', 'Umidade (%)', 'Grau Compactação (%)']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 64, 175],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8
        }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Resultados e conclusões
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resultados e Conclusões', 20, currentY);
    currentY += 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const grauMedio = ensaio.grauCompactacaoMedio || 0;
    let conclusao = '';
    let status = '';
    
    if (grauMedio >= 95) {
      status = 'EXCELENTE';
      conclusao = 'O grau de compactação está excelente, acima dos 95% requeridos.';
    } else if (grauMedio >= 90) {
      status = 'BOM';
      conclusao = 'O grau de compactação está bom, entre 90% e 95%.';
    } else {
      status = 'INSUFICIENTE';
      conclusao = 'O grau de compactação está abaixo dos 90% requeridos. É necessário recompactar.';
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(status, 80, currentY);
    currentY += 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Conclusão:', 20, currentY);
    currentY += 8;
    
    // Quebrar texto da conclusão em múltiplas linhas
    const maxWidth = doc.internal.pageSize.width - 40;
    const words = conclusao.split(' ');
    let line = '';
    let lines = [];
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const testWidth = doc.getTextWidth(testLine);
      if (testWidth > maxWidth && line !== '') {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line);
    
    lines.forEach(line => {
      doc.text(line.trim(), 20, currentY);
      currentY += 6;
    });
    
    // Rodapé
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 30, doc.internal.pageSize.width - 20, pageHeight - 30);
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Qualicore - Sistema de Gestão da Qualidade', 20, pageHeight - 20);
    doc.text(`Página 1 de 1`, doc.internal.pageSize.width - 40, pageHeight - 20);
    
    // Gerar URL do PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  }

  static async generateEnsaiosCompactacaoFilteredReport(ensaios: any[]): Promise<void> {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Qualicore', 20, 20);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ASCH Infraestructuras y Servicios SA', 20, 28);
    doc.text('Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa', 20, 32);
    
    // Título
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Filtrado - Ensaios de Compactação', 20, 60);
    
    // Informações do relatório
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 75);
    doc.text(`Total de Ensaios: ${ensaios.length}`, 20, 85);
    
    // Tabela de ensaios
    let y = 100;
    const headers = ['Ensaio', 'Obra', 'Localização', 'Elemento', 'Densidade Média', 'Grau Compactação'];
    const colWidths = [30, 40, 35, 25, 25, 25];
    
    // Cabeçalho da tabela
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    
    let x = 20;
    headers.forEach((header, i) => {
      doc.text(header, x + 2, y + 7);
      x += colWidths[i];
    });
    
    y += 15;
    
    // Dados da tabela
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    ensaios.forEach(ensaio => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      x = 20;
      const rowData = [
        ensaio.numeroEnsaio,
        ensaio.obra,
        ensaio.localizacao,
        ensaio.elemento,
        `${ensaio.densidadeSecaMedia?.toFixed(2) || 'N/A'}`,
        `${ensaio.grauCompactacaoMedio?.toFixed(1) || 'N/A'}%`
      ];
      
      rowData.forEach((text, i) => {
        doc.text(text.substring(0, 15), x + 2, y + 5);
        x += colWidths[i];
      });
      
      y += 8;
    });
    
    // Download do PDF
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio-Ensaios-Compactacao-Filtrado-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async generateEnsaiosCompactacaoExecutiveReport(ensaios: any[]): Promise<void> {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Qualicore', 20, 20);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ASCH Infraestructuras y Servicios SA', 20, 28);
    doc.text('Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa', 20, 32);
    
    // Título
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Executivo - Ensaios de Compactação', 20, 60);
    
    // Estatísticas
    const totalEnsaios = ensaios.length;
    const obrasUnicas = [...new Set(ensaios.map(e => e.obra))];
    const densidadeMedia = ensaios.reduce((sum, e) => sum + (e.densidadeSecaMedia || 0), 0) / totalEnsaios;
    const grauCompactacaoMedia = ensaios.reduce((sum, e) => sum + (e.grauCompactacaoMedio || 0), 0) / totalEnsaios;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Executivo', 20, 80);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de Ensaios: ${totalEnsaios}`, 20, 95);
    doc.text(`Obras Analisadas: ${obrasUnicas.length}`, 20, 105);
    doc.text(`Densidade Seca Média: ${densidadeMedia.toFixed(2)} g/cm³`, 20, 115);
    doc.text(`Grau de Compactação Médio: ${grauCompactacaoMedia.toFixed(1)}%`, 20, 125);
    
    // Análise por obra
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Análise por Obra', 20, 150);
    
    let y = 165;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    obrasUnicas.forEach(obra => {
      const ensaiosObra = ensaios.filter(e => e.obra === obra);
      const mediaObra = ensaiosObra.reduce((sum, e) => sum + (e.grauCompactacaoMedio || 0), 0) / ensaiosObra.length;
      
      doc.text(`${obra}: ${ensaiosObra.length} ensaios, ${mediaObra.toFixed(1)}% compactação média`, 20, y);
      y += 8;
      
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Download do PDF
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio-Executivo-Ensaios-Compactacao-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Métodos para relatórios de Armaduras
  private gerarRelatorioExecutivoArmaduras(options: RelatorioArmadurasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasArmaduras(options.armaduras, startY);
    currentY = this.addRelatorioExecutivoArmaduras(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoArmaduras(options: RelatorioArmadurasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosArmaduras(options.filtros, startY);
    currentY = this.addRelatorioFiltradoArmaduras(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoArmaduras(options: RelatorioArmadurasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoArmaduras(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualArmaduras(options: RelatorioArmadurasOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualArmaduras(options, startY);
    
    this.addProfessionalFooter();
  }

  private addEstatisticasArmaduras(armaduras: Armadura[], startY: number): number {
    const stats = {
      total: armaduras.length,
      pesoTotal: armaduras.reduce((sum, a) => sum + a.peso_total, 0),
      aprovadas: armaduras.filter(a => a.estado === "aprovado").length,
      pendentes: armaduras.filter(a => a.estado === "pendente").length,
      fabricantesUnicos: new Set(armaduras.map(a => a.fabricante)).size,
      taxaAprovacao: armaduras.length > 0 ? 
        ((armaduras.filter(a => a.estado === "aprovado").length / armaduras.length) * 100).toFixed(1) : "0"
    };

    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais', 20, startY);

    // KPIs em grid 2x3
    const kpiY = startY + 15;
    this.addKPICard(20, kpiY, 'Total Armaduras', stats.total.toString(), [59, 130, 246]);
    this.addKPICard(75, kpiY, 'Peso Total', `${stats.pesoTotal.toFixed(1)} kg`, [34, 197, 94]);
    this.addKPICard(130, kpiY, 'Taxa Aprovação', `${stats.taxaAprovacao}%`, [168, 85, 247]);
    this.addKPICard(20, kpiY + 25, 'Aprovadas', stats.aprovadas.toString(), [34, 197, 94]);
    this.addKPICard(75, kpiY + 25, 'Pendentes', stats.pendentes.toString(), [245, 158, 11]);
    this.addKPICard(130, kpiY + 25, 'Fabricantes', stats.fabricantesUnicos.toString(), [59, 130, 246]);

    return kpiY + 50;
  }

  private addFiltrosArmaduras(filtros: any, startY: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);

    let currentY = startY + 10;
    const filtrosAplicados = [];

    if (filtros.tipo) filtrosAplicados.push(`Tipo: ${filtros.tipo}`);
    if (filtros.estado) filtrosAplicados.push(`Estado: ${filtros.estado}`);
    if (filtros.fabricante) filtrosAplicados.push(`Fabricante: ${filtros.fabricante}`);
    if (filtros.zona) filtrosAplicados.push(`Zona: ${filtros.zona}`);
    if (filtros.dataInicio) filtrosAplicados.push(`Data Início: ${filtros.dataInicio}`);
    if (filtros.dataFim) filtrosAplicados.push(`Data Fim: ${filtros.dataFim}`);
    if (filtros.diametroMin) filtrosAplicados.push(`Diâmetro Min: ${filtros.diametroMin}mm`);
    if (filtros.diametroMax) filtrosAplicados.push(`Diâmetro Max: ${filtros.diametroMax}mm`);

    filtrosAplicados.forEach(filtro => {
      this.doc.text(filtro, 25, currentY);
      currentY += 6;
    });

    return currentY + 10;
  }

  private addRelatorioExecutivoArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    const armaduras = options.armaduras;

    // Análise por tipo
    const analisePorTipo = armaduras.reduce((acc, armadura) => {
      acc[armadura.tipo] = (acc[armadura.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por fabricante
    const analisePorFabricante = armaduras.reduce((acc, armadura) => {
      acc[armadura.fabricante] = (acc[armadura.fabricante] || 0) + armadura.peso_total;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Detalhada', 20, startY);

    let currentY = startY + 15;

    // Análise por tipo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo.replace('_', ' ')}: ${quantidade} armaduras`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por fabricante
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Peso Total por Fabricante:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorFabricante)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([fabricante, peso]) => {
        this.doc.text(`${fabricante}: ${peso.toFixed(1)} kg`, 25, currentY);
        currentY += 6;
      });

    return currentY;
  }

  private addRelatorioFiltradoArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    const armaduras = options.armaduras;

    // Tabela de armaduras
    autoTable(this.doc, {
      startY: startY,
      head: [['Código', 'Tipo', 'Diâmetro', 'Quantidade', 'Peso Total', 'Fabricante', 'Nº Colada', 'Estado', 'Local Aplicação', 'Responsável', 'Data Receção']],
      body: armaduras.map(armadura => [
        armadura.codigo,
        armadura.tipo.replace('_', ' '),
        `${armadura.diametro} mm`,
        armadura.quantidade.toString(),
        `${armadura.peso_total} kg`,
        armadura.fabricante,
        armadura.numero_colada,
        armadura.estado.replace('_', ' '),
        armadura.local_aplicacao,
        armadura.responsavel,
        new Date(armadura.data_rececao).toLocaleDateString("pt-PT")
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 15, right: 15 },
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addRelatorioComparativoArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    const armaduras = options.armaduras;

    // Análise por estado
    const analisePorEstado = armaduras.reduce((acc, armadura) => {
      acc[armadura.estado] = (acc[armadura.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por diâmetro
    const analisePorDiametro = armaduras.reduce((acc, armadura) => {
      acc[armadura.diametro] = (acc[armadura.diametro] || 0) + armadura.peso_total;
      return acc;
    }, {} as Record<number, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);

    let currentY = startY + 15;

    // Análise por estado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Estado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorEstado).forEach(([estado, quantidade]) => {
      this.doc.text(`${estado.replace('_', ' ')}: ${quantidade} armaduras`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por diâmetro
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Peso Total por Diâmetro:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorDiametro)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([diametro, peso]) => {
        this.doc.text(`${diametro}mm: ${peso.toFixed(1)} kg`, 25, currentY);
        currentY += 6;
      });

    return currentY;
  }

  gerarRelatorioArmaduras(options: RelatorioArmadurasOptions): void {
    try {
      this.doc = new jsPDF();
      this.pageNumber = 1;
      
      // Cabeçalho profissional
      this.addProfessionalHeader(options.titulo, options.subtitulo);
      
      let currentY = 85; // Posição inicial após cabeçalho
      
      // Adicionar filtros se aplicável
      if (options.filtros && Object.keys(options.filtros).length > 0) {
        currentY = this.addFiltrosArmaduras(options.filtros, currentY);
        currentY += 10;
      }

      // Gerar relatório baseado no tipo
      switch (options.tipo) {
        case 'executivo':
          currentY = this.addRelatorioExecutivoArmaduras(options, currentY);
          break;
        case 'filtrado':
          currentY = this.addRelatorioFiltradoArmaduras(options, currentY);
          break;
        case 'comparativo':
          currentY = this.addRelatorioComparativoArmaduras(options, currentY);
          break;
        case 'individual':
          currentY = this.addRelatorioIndividualArmaduras(options, currentY);
          break;
      }
      
      // Calcular total de páginas
      this.totalPages = Math.ceil(currentY / this.doc.internal.pageSize.height);
      
      // Adicionar rodapé
      this.addProfessionalFooter();
      
      // Download
      this.doc.save(`${options.titulo.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("Erro ao gerar relatório de armaduras:", error);
      throw error;
    }
  }

  private addRelatorioIndividualArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    const armadura = options.armaduraEspecifica;
    if (!armadura) return startY;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, startY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Armadura', 20, startY + 2);

    // KPIs
    const kpiY = startY + 12;
    this.addKPICard(20, kpiY, 'Estado', armadura.estado.replace('_', ' '), [59, 130, 246]);
    this.addKPICard(75, kpiY, 'Peso Total', `${armadura.peso_total} kg`, [34, 197, 94]);
    this.addKPICard(130, kpiY, 'Diâmetro', `${armadura.diametro} mm`, [168, 85, 247]);

    // Informações básicas
    const infoY = kpiY + 30;
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(15, infoY - 5, 180, 60, 'F');

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas', 20, infoY);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Código: ${armadura.codigo}`,
      `Tipo: ${armadura.tipo.replace('_', ' ')}`,
      `Fabricante: ${armadura.fabricante}`,
      `Nº Colada: ${armadura.numero_colada}`,
      `Nº Guia Remessa: ${armadura.numero_guia_remessa}`,
      `Local Aplicação: ${armadura.local_aplicacao}`,
      `Zona Aplicação: ${armadura.zona_aplicacao}`,
      `Lote Aplicação: ${armadura.lote_aplicacao}`,
      `Responsável: ${armadura.responsavel}`,
      `Data Receção: ${new Date(armadura.data_rececao).toLocaleDateString("pt-PT")}`
    ];

    let currentY = infoY + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    return currentY + 10;
  }



  async gerarRelatorioCertificados(options: RelatorioCertificadosOptions): Promise<void> {
    this.initDocument();
    this.pageNumber = 1;

    try {
      await this.addProfessionalHeader();
      
      switch (options.tipo) {
        case 'executivo':
          await this.gerarRelatorioExecutivoCertificados(options);
          break;
        case 'filtrado':
          await this.gerarRelatorioFiltradoCertificados(options);
          break;
        case 'comparativo':
          await this.gerarRelatorioComparativoCertificados(options);
          break;
        case 'individual':
          await this.gerarRelatorioIndividualCertificados(options);
          break;
      }

      await this.addProfessionalFooter();
      this.doc.save(`Relatorio-Certificados-${options.tipo}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório de certificados:', error);
      throw error;
    }
  }

  private async gerarRelatorioExecutivoCertificados(options: RelatorioCertificadosOptions): Promise<void> {
    const certificados = options.certificados;
    
    // Estatísticas gerais
    const stats = {
      total: certificados.length,
      validos: certificados.filter(c => c.status === 'valido').length,
      expirados: certificados.filter(c => c.status === 'expirado').length,
      pendentes: certificados.filter(c => c.status === 'pendente').length,
      fornecedores: new Set(certificados.map(c => c.fornecedor)).size
    };

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resumo Executivo', 20, 80 + 2);

    // KPIs
    const kpiY = 80 + 12;
    this.addKPICard(20, kpiY, 'Total', stats.total.toString(), [59, 130, 246]);
    this.addKPICard(75, kpiY, 'Válidos', stats.validos.toString(), [34, 197, 94]);
    this.addKPICard(130, kpiY, 'Expirados', stats.expirados.toString(), [239, 68, 68]);
    this.addKPICard(185, kpiY, 'Pendentes', stats.pendentes.toString(), [245, 158, 11]);
  }

  private async gerarRelatorioFiltradoCertificados(options: RelatorioCertificadosOptions): Promise<void> {
    const certificados = options.certificados;
    
    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Detalhes dos Certificados', 20, 80 + 2);

    // Preparar dados para tabela
    const tableData = certificados.map(certificado => [
      certificado.codigo,
      certificado.tipo,
      certificado.fornecedor,
      certificado.status,
      new Date(certificado.data_validade).toLocaleDateString("pt-PT"),
      certificado.responsavel
    ]);

    // Adicionar tabela
    autoTable(this.doc, {
      startY: 80 + 15,
      head: [['Código', 'Tipo', 'Fornecedor', 'Status', 'Validade', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
  }

  private async gerarRelatorioComparativoCertificados(options: RelatorioCertificadosOptions): Promise<void> {
    const certificados = options.certificados;
    
    // Análise por status
    const analisePorStatus = certificados.reduce((acc, certificado) => {
      acc[certificado.status] = (acc[certificado.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo
    const analisePorTipo = certificados.reduce((acc, certificado) => {
      acc[certificado.tipo] = (acc[certificado.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 80);

    let currentY = 80 + 15;

    // Análise por status
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Status:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorStatus).forEach(([status, quantidade]) => {
      this.doc.text(`${status}: ${quantidade} certificados`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} certificados`, 25, currentY);
      currentY += 6;
    });
  }

  private async gerarRelatorioIndividualCertificados(options: RelatorioCertificadosOptions): Promise<void> {
    const certificado = options.certificadoIndividual;
    if (!certificado) return;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica do Certificado', 20, 80 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 100);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Código: ${certificado.codigo}`,
      `Tipo: ${certificado.tipo}`,
      `Fornecedor: ${certificado.fornecedor}`,
      `Status: ${certificado.status}`,
      `Data de Validade: ${new Date(certificado.data_validade).toLocaleDateString("pt-PT")}`,
      `Responsável: ${certificado.responsavel}`,
      `Descrição: ${certificado.descricao || 'N/A'}`
    ];

    let currentY = 100 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
  }

  // Método principal para relatórios de Normas
  gerarRelatorioNormas(options: RelatorioNormasOptions): void {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoNormas(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoNormas(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoNormas(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualNormas(options);
        break;
      default:
        this.gerarRelatorioExecutivoNormas(options);
    }

    this.doc.save(`Relatorio_Normas_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoNormas(options: RelatorioNormasOptions): void {
    const normas = options.normas;
    
    // Estatísticas
    const totalNormas = normas.length;
    const normasAtivas = normas.filter(n => n.status === 'ATIVA').length;
    const normasRevisao = normas.filter(n => n.status === 'REVISAO').length;
    const normasObsoletas = normas.filter(n => n.status === 'OBSOLETA').length;
    const normasCriticas = normas.filter(n => n.prioridade === 'CRITICA').length;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resumo Executivo', 20, 80 + 2);

    // Estatísticas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais:', 20, 100);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const estatisticas = [
      `Total de Normas: ${totalNormas}`,
      `Normas Ativas: ${normasAtivas}`,
      `Em Revisão: ${normasRevisao}`,
      `Obsoletas: ${normasObsoletas}`,
      `Prioridade Crítica: ${normasCriticas}`
    ];

    let currentY = 100 + 12;
    estatisticas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    currentY += 10;

    // Análise por categoria
    const analisePorCategoria = normas.reduce((acc, norma) => {
      acc[norma.categoria] = (acc[norma.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Categoria:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorCategoria)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([categoria, count]) => {
        this.doc.text(`${categoria}: ${count} normas`, 25, currentY);
        currentY += 5;
      });
  }

  private gerarRelatorioFiltradoNormas(options: RelatorioNormasOptions): void {
    const normas = options.normas;
    const filtros = options.filtros;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Relatório Filtrado', 20, 80 + 2);

    // Filtros aplicados
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados:', 20, 100);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    let currentY = 100 + 12;
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          this.doc.text(`${key}: ${value}`, 25, currentY);
          currentY += 5;
        }
      });
    }

    currentY += 10;

    // Tabela de normas
    const tableData = normas.map(norma => [
      norma.codigo,
      norma.titulo.substring(0, 30) + (norma.titulo.length > 30 ? '...' : ''),
      norma.categoria,
      norma.organismo,
      norma.status,
      norma.prioridade,
      new Date(norma.data_publicacao).toLocaleDateString('pt-PT')
    ]);

    autoTable(this.doc, {
      startY: currentY,
      head: [['Código', 'Título', 'Categoria', 'Organismo', 'Status', 'Prioridade', 'Data Pub.']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
  }

  private gerarRelatorioComparativoNormas(options: RelatorioNormasOptions): void {
    const normas = options.normas;
    
    // Análise por status
    const analisePorStatus = normas.reduce((acc, norma) => {
      acc[norma.status] = (acc[norma.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por organismo
    const analisePorOrganismo = normas.reduce((acc, norma) => {
      acc[norma.organismo] = (acc[norma.organismo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 80);

    let currentY = 80 + 15;

    // Análise por status
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Status:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorStatus).forEach(([status, quantidade]) => {
      this.doc.text(`${status}: ${quantidade} normas`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por organismo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Organismo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorOrganismo).forEach(([organismo, quantidade]) => {
      this.doc.text(`${organismo}: ${quantidade} normas`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioIndividualNormas(options: RelatorioNormasOptions): void {
    const norma = options.normaEspecifica;
    if (!norma) return;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Norma', 20, 80 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 100);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Código: ${norma.codigo}`,
      `Título: ${norma.titulo}`,
      `Categoria: ${norma.categoria}`,
      `Organismo: ${norma.organismo}`,
      `Versão: ${norma.versao}`,
      `Status: ${norma.status}`,
      `Prioridade: ${norma.prioridade}`,
      `Data de Publicação: ${new Date(norma.data_publicacao).toLocaleDateString("pt-PT")}`,
      `Entrada em Vigor: ${new Date(norma.data_entrada_vigor).toLocaleDateString("pt-PT")}`,
      `Descrição: ${norma.descricao || 'N/A'}`
    ];

    let currentY = 100 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });
  }

  // ===== RELATÓRIOS SUBMISSÃO MATERIAIS =====
  async gerarRelatorioSubmissaoMateriais(options: RelatorioSubmissaoMateriaisOptions): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoSubmissaoMateriais(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoSubmissaoMateriais(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoSubmissaoMateriais(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualSubmissaoMateriais(options);
        break;
    }

    this.doc.save(`relatorio_submissoes_materiais_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoSubmissaoMateriais(options: RelatorioSubmissaoMateriaisOptions): void {
    const submissoes = options.submissoes;
    
    // Estatísticas
    const totalSubmissoes = submissoes.length;
    const aprovadas = submissoes.filter(s => s.estado === 'aprovado').length;
    const pendentes = submissoes.filter(s => ['submetido', 'em_revisao', 'aguardando_aprovacao'].includes(s.estado)).length;
    const rejeitadas = submissoes.filter(s => s.estado === 'rejeitado').length;
    const urgentes = submissoes.filter(s => s.urgencia === 'urgente' || s.urgencia === 'muito_urgente').length;
    const criticas = submissoes.filter(s => s.prioridade === 'critica').length;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resumo Executivo', 20, 80 + 2);

    // Estatísticas principais
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais:', 20, 100);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(75, 85, 99);

    const estatisticas = [
      `Total de Submissões: ${totalSubmissoes}`,
      `Aprovadas: ${aprovadas} (${totalSubmissoes > 0 ? ((aprovadas / totalSubmissoes) * 100).toFixed(1) : 0}%)`,
      `Pendentes: ${pendentes} (${totalSubmissoes > 0 ? ((pendentes / totalSubmissoes) * 100).toFixed(1) : 0}%)`,
      `Rejeitadas: ${rejeitadas} (${totalSubmissoes > 0 ? ((rejeitadas / totalSubmissoes) * 100).toFixed(1) : 0}%)`,
      `Urgentes: ${urgentes}`,
      `Críticas: ${criticas}`
    ];

    let currentY = 100 + 12;
    estatisticas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });

    // Análise por tipo de material
    currentY += 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Análise por Tipo de Material:', 20, currentY);
    currentY += 8;

    const tiposMaterial = submissoes.reduce((acc, s) => {
      acc[s.tipo_material] = (acc[s.tipo_material] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFont('helvetica', 'normal');
    Object.entries(tiposMaterial).forEach(([tipo, count]) => {
      this.doc.text(`${tipo}: ${count} submissões`, 25, currentY);
      currentY += 5;
    });
  }

  private gerarRelatorioFiltradoSubmissaoMateriais(options: RelatorioSubmissaoMateriaisOptions): void {
    const submissoes = options.submissoes;
    
    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Relatório Detalhado', 20, 80 + 2);

    // Filtros aplicados
    if (options.filtros && options.filtros.length > 0) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Filtros Aplicados:', 20, 100);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(75, 85, 99);
      this.doc.text(options.filtros.join(', '), 25, 110);
    }

    // Tabela de submissões
    const tableData = submissoes.map(submissao => [
      submissao.codigo,
      submissao.titulo,
      submissao.tipo_material,
      submissao.categoria,
      submissao.estado,
      submissao.prioridade,
      submissao.submissor_nome,
      new Date(submissao.data_submissao).toLocaleDateString('pt-BR'),
      submissao.obra_nome || 'N/A'
    ]);

    autoTable(this.doc, {
      startY: 120,
      head: [['Código', 'Título', 'Tipo', 'Categoria', 'Estado', 'Prioridade', 'Submissor', 'Data', 'Obra']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
  }

  private gerarRelatorioComparativoSubmissaoMateriais(options: RelatorioSubmissaoMateriaisOptions): void {
    const submissoes = options.submissoes;
    
    // Análise por estado
    const analisePorEstado = submissoes.reduce((acc, submissao) => {
      acc[submissao.estado] = (acc[submissao.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo de material
    const analisePorTipo = submissoes.reduce((acc, submissao) => {
      acc[submissao.tipo_material] = (acc[submissao.tipo_material] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 80);

    let currentY = 80 + 15;

    // Análise por estado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Estado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorEstado).forEach(([estado, quantidade]) => {
      this.doc.text(`${estado}: ${quantidade} submissões`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo de material
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo de Material:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} submissões`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioIndividualSubmissaoMateriais(options: RelatorioSubmissaoMateriaisOptions): void {
    const submissao = options.submissoes[0];
    if (!submissao) return;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 80 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Submissão', 20, 80 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 100);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Código: ${submissao.codigo}`,
      `Título: ${submissao.titulo}`,
      `Descrição: ${submissao.descricao}`,
      `Tipo de Material: ${submissao.tipo_material}`,
      `Categoria: ${submissao.categoria}`,
      `Estado: ${submissao.estado}`,
      `Prioridade: ${submissao.prioridade}`,
      `Urgência: ${submissao.urgencia}`,
      `Submissor: ${submissao.submissor_nome}`,
      `Data de Submissão: ${new Date(submissao.data_submissao).toLocaleDateString("pt-PT")}`,
      `Obra: ${submissao.obra_nome || 'N/A'}`,
      `Fornecedor Sugerido: ${submissao.fornecedor_sugerido || 'N/A'}`,
      `Impacto Custo: ${submissao.impacto_custo ? `€${submissao.impacto_custo.toLocaleString()}` : 'N/A'}`,
      `Impacto Prazo: ${submissao.impacto_prazo ? `${submissao.impacto_prazo} dias` : 'N/A'}`
    ];

    let currentY = 100 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Especificações técnicas
    if (submissao.especificacoes_tecnicas) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Especificações Técnicas:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      const especificacoes = submissao.especificacoes_tecnicas.split('\n');
      especificacoes.forEach(linha => {
        this.doc.text(linha, 25, currentY);
        currentY += 4;
      });
    }
  }

  // ===== RELATÓRIOS DE SINALIZAÇÃO =====

  async gerarRelatorioSinalizacao(options: RelatorioSinalizacaoOptions): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoSinalizacao(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoSinalizacao(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoSinalizacao(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualSinalizacao(options);
        break;
    }

    this.doc.save(`relatorio_sinalizacoes_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoSinalizacao(options: RelatorioSinalizacaoOptions): void {
    const sinalizacoes = options.sinalizacoes;
    
    // Estatísticas
    const total = sinalizacoes.length;
    const operacionais = sinalizacoes.filter(s => s.estado === 'operacional').length;
    const manutencao = sinalizacoes.filter(s => s.estado === 'manutencao').length;
    const avariadas = sinalizacoes.filter(s => s.estado === 'avariada').length;
    const ativas = sinalizacoes.filter(s => s.status_operacional === 'ativo').length;
    const kmCobertos = sinalizacoes.reduce((total, s) => total + (s.km_final - s.km_inicial), 0);

    // Resumo executivo
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, 100);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);

    const resumo = [
      `Total de Sinalizações: ${total}`,
      `Operacionais: ${operacionais} (${total > 0 ? ((operacionais / total) * 100).toFixed(1) : 0}%)`,
      `Em Manutenção: ${manutencao} (${total > 0 ? ((manutencao / total) * 100).toFixed(1) : 0}%)`,
      `Avariadas: ${avariadas} (${total > 0 ? ((avariadas / total) * 100).toFixed(1) : 0}%)`,
      `Ativas: ${ativas} (${total > 0 ? ((ativas / total) * 100).toFixed(1) : 0}%)`,
      `KM Cobertos: ${kmCobertos.toFixed(1)} km`
    ];

    let currentY = 100 + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 8;
    });

    // Análise por tipo
    const tipos = sinalizacoes.reduce((acc, s) => {
      acc[s.tipo] = (acc[s.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(tipos).forEach(([tipo, count]) => {
      this.doc.text(`${tipo}: ${count}`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioFiltradoSinalizacao(options: RelatorioSinalizacaoOptions): void {
    const sinalizacoes = options.sinalizacoes;

    // Filtros aplicados
    if (options.filtros && options.filtros.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Filtros Aplicados:', 20, 100);

      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);

      let currentY = 100 + 10;
      options.filtros.forEach(filtro => {
        this.doc.text(`• ${filtro}`, 25, currentY);
        currentY += 6;
      });

      currentY += 10;
    }

    // Tabela de sinalizações
    const tableData = sinalizacoes.map(s => [
      s.codigo,
      s.tipo,
      s.localizacao,
      s.estado,
      s.status_operacional,
      s.fabricante,
      `${s.km_inicial} - ${s.km_final}`,
      new Date(s.data_instalacao).toLocaleDateString('pt-PT')
    ]);

    autoTable(this.doc, {
      head: [['Código', 'Tipo', 'Localização', 'Estado', 'Status', 'Fabricante', 'KM', 'Data Instalação']],
      body: tableData,
      startY: options.filtros && options.filtros.length > 0 ? 150 : 100,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
  }

  private gerarRelatorioComparativoSinalizacao(options: RelatorioSinalizacaoOptions): void {
    const sinalizacoes = options.sinalizacoes;

    // Análise por estado
    const analisePorEstado = sinalizacoes.reduce((acc, s) => {
      acc[s.estado] = (acc[s.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo
    const analisePorTipo = sinalizacoes.reduce((acc, s) => {
      acc[s.tipo] = (acc[s.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 100);

    let currentY = 100 + 15;

    // Análise por estado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Estado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorEstado).forEach(([estado, quantidade]) => {
      this.doc.text(`${estado}: ${quantidade} sinalizações`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} sinalizações`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioIndividualSinalizacao(options: RelatorioSinalizacaoOptions): void {
    const sinalizacao = options.sinalizacoes[0];
    if (!sinalizacao) return;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Sinalização', 20, 100 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 120);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Código: ${sinalizacao.codigo}`,
      `Tipo: ${sinalizacao.tipo}`,
      `Categoria: ${sinalizacao.categoria}`,
      `Localização: ${sinalizacao.localizacao}`,
      `Estado: ${sinalizacao.estado}`,
      `Status Operacional: ${sinalizacao.status_operacional}`,
      `Fabricante: ${sinalizacao.fabricante}`,
      `Modelo: ${sinalizacao.modelo}`,
      `KM: ${sinalizacao.km_inicial} - ${sinalizacao.km_final}`,
      `Data de Instalação: ${new Date(sinalizacao.data_instalacao).toLocaleDateString("pt-PT")}`,
      `Última Inspeção: ${new Date(sinalizacao.ultima_inspecao).toLocaleDateString("pt-PT")}`,
      `Próxima Inspeção: ${new Date(sinalizacao.proxima_inspecao).toLocaleDateString("pt-PT")}`
    ];

    let currentY = 120 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Parâmetros técnicos
    currentY += 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Parâmetros Técnicos:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    const parametros = [
      `Alcance: ${sinalizacao.parametros.alcance} m`,
      `Frequência: ${sinalizacao.parametros.frequencia}`,
      `Potência: ${sinalizacao.parametros.potencia} W`,
      `Sensibilidade: ${sinalizacao.parametros.sensibilidade} dBm`
    ];

    parametros.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Observações
    if (sinalizacao.observacoes) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Observações:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      const observacoes = sinalizacao.observacoes.split('\n');
      observacoes.forEach(linha => {
        this.doc.text(linha, 25, currentY);
        currentY += 4;
      });
    }
  }

  // ===== RELATÓRIOS DE INSPEÇÕES DE SINALIZAÇÃO =====

  async gerarRelatorioInspecaoSinalizacao(options: RelatorioInspecaoSinalizacaoOptions): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoInspecaoSinalizacao(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoInspecaoSinalizacao(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoInspecaoSinalizacao(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualInspecaoSinalizacao(options);
        break;
    }

    this.doc.save(`relatorio_inspecoes_sinalizacao_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoInspecaoSinalizacao(options: RelatorioInspecaoSinalizacaoOptions): void {
    const inspecoes = options.inspecoes;
    
    // Estatísticas
    const total = inspecoes.length;
    const aprovadas = inspecoes.filter(i => i.resultado === 'aprovado').length;
    const aprovadas_condicional = inspecoes.filter(i => i.resultado === 'aprovado_condicional').length;
    const reprovadas = inspecoes.filter(i => i.resultado === 'reprovado').length;
    const pendentes = inspecoes.filter(i => i.resultado === 'pendente').length;
    const preventivas = inspecoes.filter(i => i.tipo === 'preventiva').length;

    // Resumo executivo
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, 100);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);

    const resumo = [
      `Total de Inspeções: ${total}`,
      `Aprovadas: ${aprovadas} (${total > 0 ? ((aprovadas / total) * 100).toFixed(1) : 0}%)`,
      `Aprovadas Condicional: ${aprovadas_condicional} (${total > 0 ? ((aprovadas_condicional / total) * 100).toFixed(1) : 0}%)`,
      `Reprovadas: ${reprovadas} (${total > 0 ? ((reprovadas / total) * 100).toFixed(1) : 0}%)`,
      `Pendentes: ${pendentes} (${total > 0 ? ((pendentes / total) * 100).toFixed(1) : 0}%)`,
      `Preventivas: ${preventivas} (${total > 0 ? ((preventivas / total) * 100).toFixed(1) : 0}%)`
    ];

    let currentY = 100 + 15;
    resumo.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 8;
    });

    // Análise por tipo
    const tipos = inspecoes.reduce((acc, i) => {
      acc[i.tipo] = (acc[i.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    currentY += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(tipos).forEach(([tipo, count]) => {
      this.doc.text(`${tipo}: ${count}`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioFiltradoInspecaoSinalizacao(options: RelatorioInspecaoSinalizacaoOptions): void {
    const inspecoes = options.inspecoes;

    // Filtros aplicados
    if (options.filtros && options.filtros.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Filtros Aplicados:', 20, 100);

      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);

      let currentY = 100 + 10;
      options.filtros.forEach(filtro => {
        this.doc.text(`• ${filtro}`, 25, currentY);
        currentY += 6;
      });

      currentY += 10;
    }

    // Tabela de inspeções
    const tableData = inspecoes.map(i => [
      new Date(i.data_inspecao).toLocaleDateString('pt-PT'),
      i.tipo,
      i.inspector,
      i.resultado,
      new Date(i.proxima_inspecao).toLocaleDateString('pt-PT')
    ]);

    autoTable(this.doc, {
      head: [['Data', 'Tipo', 'Inspector', 'Resultado', 'Próxima Inspeção']],
      body: tableData,
      startY: options.filtros && options.filtros.length > 0 ? 150 : 100,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
  }

  private gerarRelatorioComparativoInspecaoSinalizacao(options: RelatorioInspecaoSinalizacaoOptions): void {
    const inspecoes = options.inspecoes;

    // Análise por resultado
    const analisePorResultado = inspecoes.reduce((acc, i) => {
      acc[i.resultado] = (acc[i.resultado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo
    const analisePorTipo = inspecoes.reduce((acc, i) => {
      acc[i.tipo] = (acc[i.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 100);

    let currentY = 100 + 15;

    // Análise por resultado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Resultado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorResultado).forEach(([resultado, quantidade]) => {
      this.doc.text(`${resultado}: ${quantidade} inspeções`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} inspeções`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioIndividualInspecaoSinalizacao(options: RelatorioInspecaoSinalizacaoOptions): void {
    const inspecao = options.inspecoes[0];
    if (!inspecao) return;

    // Título da seção
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Inspeção', 20, 100 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 120);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Data da Inspeção: ${new Date(inspecao.data_inspecao).toLocaleDateString("pt-PT")}`,
      `Tipo: ${inspecao.tipo}`,
      `Inspector: ${inspecao.inspector}`,
      `Resultado: ${inspecao.resultado}`,
      `Próxima Inspeção: ${new Date(inspecao.proxima_inspecao).toLocaleDateString("pt-PT")}`,
      `Sinalização ID: ${inspecao.sinalizacao_id}`
    ];

    let currentY = 120 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Observações
    if (inspecao.observacoes) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Observações:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      const observacoes = inspecao.observacoes.split('\n');
      observacoes.forEach(linha => {
        this.doc.text(linha, 25, currentY);
        currentY += 4;
      });
    }

    // Ações corretivas
  }

  // Métodos para Segurança Ferroviária
  async gerarRelatorioSegurancaFerroviaria(options: RelatorioSegurancaFerroviariaOptions): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoSegurancaFerroviaria(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoSegurancaFerroviaria(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoSegurancaFerroviaria(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualSegurancaFerroviaria(options);
        break;
    }

    this.doc.save(`relatorio_seguranca_ferroviaria_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async gerarRelatorioInspecaoSeguranca(options: RelatorioInspecaoSegurancaOptions): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoInspecaoSeguranca(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoInspecaoSeguranca(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoInspecaoSeguranca(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualInspecaoSeguranca(options);
        break;
    }

    this.doc.save(`relatorio_inspecoes_seguranca_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoSegurancaFerroviaria(options: RelatorioSegurancaFerroviariaOptions): void {
    const sistemas = options.sistemas;

    // Estatísticas
    const stats = {
      total: sistemas.length,
      operacionais: sistemas.filter(s => s.status_operacional === 'Operacional').length,
      manutencao: sistemas.filter(s => s.status_operacional === 'Manutenção').length,
      avaria: sistemas.filter(s => s.status_operacional === 'Avaria').length,
      ativos: sistemas.filter(s => s.estado === 'Ativo').length,
      inativos: sistemas.filter(s => s.estado === 'Inativo').length,
      criticos: sistemas.filter(s => s.parametros?.nivel_seguranca > 8).length
    };

    // Título da seção
    this.doc.setFillColor(239, 68, 68);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resumo Executivo - Sistemas de Segurança', 20, 100 + 2);

    // Estatísticas principais
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Principais:', 20, 120);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const estatisticas = [
      `Total de Sistemas: ${stats.total}`,
      `Sistemas Operacionais: ${stats.operacionais}`,
      `Sistemas em Manutenção: ${stats.manutencao}`,
      `Sistemas em Avaria: ${stats.avaria}`,
      `Sistemas Ativos: ${stats.ativos}`,
      `Sistemas Inativos: ${stats.inativos}`,
      `Sistemas Críticos: ${stats.criticos}`
    ];

    let currentY = 120 + 12;
    estatisticas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Análise por tipo
    currentY += 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    const tipos = sistemas.reduce((acc, s) => {
      acc[s.tipo] = (acc[s.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFont('helvetica', 'normal');
    Object.entries(tipos).forEach(([tipo, count]) => {
      this.doc.text(`${tipo}: ${count} sistemas`, 25, currentY);
      currentY += 5;
    });
  }

  private gerarRelatorioFiltradoSegurancaFerroviaria(options: RelatorioSegurancaFerroviariaOptions): void {
    const sistemas = options.sistemas;

    // Título da seção
    this.doc.setFillColor(239, 68, 68);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Sistemas de Segurança - Dados Filtrados', 20, 100 + 2);

    // Tabela de sistemas
    const tableData = sistemas.map(sistema => [
      sistema.codigo,
      sistema.tipo,
      sistema.localizacao,
      sistema.status_operacional,
      sistema.estado,
      sistema.fabricante,
      sistema.ultima_inspecao ? new Date(sistema.ultima_inspecao).toLocaleDateString('pt-PT') : 'N/A'
    ]);

    autoTable(this.doc, {
      head: [['Código', 'Tipo', 'Localização', 'Status', 'Estado', 'Fabricante', 'Última Inspeção']],
      body: tableData,
      startY: 120,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: 255
      }
    });
  }

  private gerarRelatorioComparativoSegurancaFerroviaria(options: RelatorioSegurancaFerroviariaOptions): void {
    const sistemas = options.sistemas;

    // Análise por status operacional
    const analisePorStatus = sistemas.reduce((acc, s) => {
      acc[s.status_operacional] = (acc[s.status_operacional] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo
    const analisePorTipo = sistemas.reduce((acc, s) => {
      acc[s.tipo] = (acc[s.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 100);

    let currentY = 100 + 15;

    // Análise por status
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Status Operacional:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorStatus).forEach(([status, quantidade]) => {
      this.doc.text(`${status}: ${quantidade} sistemas`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} sistemas`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioIndividualSegurancaFerroviaria(options: RelatorioSegurancaFerroviariaOptions): void {
    const sistema = options.sistemas[0];
    if (!sistema) return;

    // Título da seção
    this.doc.setFillColor(239, 68, 68);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica do Sistema', 20, 100 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 120);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Código: ${sistema.codigo}`,
      `Tipo: ${sistema.tipo}`,
      `Categoria: ${sistema.categoria}`,
      `Localização: ${sistema.localizacao}`,
      `Estado: ${sistema.estado}`,
      `Status Operacional: ${sistema.status_operacional}`,
      `Fabricante: ${sistema.fabricante}`,
      `Modelo: ${sistema.modelo}`,
      `Data de Instalação: ${new Date(sistema.data_instalacao).toLocaleDateString("pt-PT")}`
    ];

    let currentY = 120 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Parâmetros técnicos
    if (sistema.parametros) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Parâmetros Técnicos:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      const parametros = [
        `Nível de Segurança: ${sistema.parametros.nivel_seguranca}`,
        `Raio de Cobertura: ${sistema.parametros.raio_cobertura}m`,
        `Tempo de Resposta: ${sistema.parametros.tempo_resposta}ms`,
        `Capacidade de Deteção: ${sistema.parametros.capacidade_deteccao}%`
      ];

      parametros.forEach(item => {
        this.doc.text(item, 25, currentY);
        currentY += 5;
      });
    }

    // Observações
    if (sistema.observacoes) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Observações:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      const observacoes = sistema.observacoes.split('\n');
      observacoes.forEach(linha => {
        this.doc.text(linha, 25, currentY);
        currentY += 4;
      });
    }
  }

  private gerarRelatorioExecutivoInspecaoSeguranca(options: RelatorioInspecaoSegurancaOptions): void {
    const inspecoes = options.inspecoes;

    // Estatísticas
    const stats = {
      total: inspecoes.length,
      conformes: inspecoes.filter(i => i.resultado === 'Conforme').length,
      naoConformes: inspecoes.filter(i => i.resultado === 'Não Conforme').length,
      pendentes: inspecoes.filter(i => i.resultado === 'Pendente').length,
      criticas: inspecoes.filter(i => i.prioridade === 'Crítica').length,
      altas: inspecoes.filter(i => i.prioridade === 'Alta').length
    };

    // Título da seção
    this.doc.setFillColor(239, 68, 68);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resumo Executivo - Inspeções de Segurança', 20, 100 + 2);

    // Estatísticas principais
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Principais:', 20, 120);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const estatisticas = [
      `Total de Inspeções: ${stats.total}`,
      `Inspeções Conformes: ${stats.conformes}`,
      `Inspeções Não Conformes: ${stats.naoConformes}`,
      `Inspeções Pendentes: ${stats.pendentes}`,
      `Inspeções Críticas: ${stats.criticas}`,
      `Inspeções de Alta Prioridade: ${stats.altas}`
    ];

    let currentY = 120 + 12;
    estatisticas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Análise por resultado
    currentY += 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Resultado:', 20, currentY);
    currentY += 8;

    const resultados = inspecoes.reduce((acc, i) => {
      acc[i.resultado] = (acc[i.resultado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFont('helvetica', 'normal');
    Object.entries(resultados).forEach(([resultado, count]) => {
      this.doc.text(`${resultado}: ${count} inspeções`, 25, currentY);
      currentY += 5;
    });
  }

  private gerarRelatorioFiltradoInspecaoSeguranca(options: RelatorioInspecaoSegurancaOptions): void {
    const inspecoes = options.inspecoes;

    // Título da seção
    this.doc.setFillColor(239, 68, 68);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Inspeções de Segurança - Dados Filtrados', 20, 100 + 2);

    // Tabela de inspeções
    const tableData = inspecoes.map(inspecao => [
      inspecao.seguranca_id,
      inspecao.tipo_inspecao,
      inspecao.resultado,
      inspecao.prioridade,
      new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT'),
      inspecao.responsavel
    ]);

    autoTable(this.doc, {
      head: [['Sistema', 'Tipo Inspeção', 'Resultado', 'Prioridade', 'Data', 'Responsável']],
      body: tableData,
      startY: 120,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: 255
      }
    });
  }

  private gerarRelatorioComparativoInspecaoSeguranca(options: RelatorioInspecaoSegurancaOptions): void {
    const inspecoes = options.inspecoes;

    // Análise por resultado
    const analisePorResultado = inspecoes.reduce((acc, i) => {
      acc[i.resultado] = (acc[i.resultado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo
    const analisePorTipo = inspecoes.reduce((acc, i) => {
      acc[i.tipo_inspecao] = (acc[i.tipo_inspecao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, 100);

    let currentY = 100 + 15;

    // Análise por resultado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Resultado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorResultado).forEach(([resultado, quantidade]) => {
      this.doc.text(`${resultado}: ${quantidade} inspeções`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} inspeções`, 25, currentY);
      currentY += 6;
    });
  }

  private gerarRelatorioIndividualInspecaoSeguranca(options: RelatorioInspecaoSegurancaOptions): void {
    const inspecao = options.inspecoes[0];
    if (!inspecao) return;

    // Título da seção
    this.doc.setFillColor(239, 68, 68);
    this.doc.rect(15, 100 - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Inspeção', 20, 100 + 2);

    // Informações básicas
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Informações Básicas:', 20, 120);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const infoBasicas = [
      `Data da Inspeção: ${new Date(inspecao.data_inspecao).toLocaleDateString("pt-PT")}`,
      `Tipo: ${inspecao.tipo_inspecao}`,
      `Responsável: ${inspecao.responsavel}`,
      `Resultado: ${inspecao.resultado}`,
      `Prioridade: ${inspecao.prioridade}`,
      `Próxima Inspeção: ${new Date(inspecao.proxima_inspecao).toLocaleDateString("pt-PT")}`,
      `Sistema ID: ${inspecao.seguranca_id}`
    ];

    let currentY = 120 + 12;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 5;
    });

    // Observações
    if (inspecao.observacoes) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Observações:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      const observacoes = inspecao.observacoes.split('\n');
      observacoes.forEach(linha => {
        this.doc.text(linha, 25, currentY);
        currentY += 4;
      });
    }

    // Ações corretivas
    if (inspecao.acoes_corretivas) {
      currentY += 10;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Ações Corretivas:', 20, currentY);
      currentY += 8;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      const acoes = inspecao.acoes_corretivas.split('\n');
      acoes.forEach(linha => {
        this.doc.text(linha, 25, currentY);
        currentY += 4;
      });
    }
  }

  // Métodos para Pontes e Túneis
  private calcularEstatisticasPontesTuneis(pontesTuneis: PonteTunel[]) {
    const total = pontesTuneis.length;
    const pontes = pontesTuneis.filter(pt => pt.tipo === 'PONTE').length;
    const tuneis = pontesTuneis.filter(pt => pt.tipo === 'TUNEL').length;
    const ativas = pontesTuneis.filter(pt => pt.estado === 'ATIVO').length;
    const emManutencao = pontesTuneis.filter(pt => pt.estado === 'MANUTENCAO').length;
    const operacionais = pontesTuneis.filter(pt => pt.status_operacional === 'OPERACIONAL').length;
    
    const comprimentoTotal = pontesTuneis.reduce((sum, pt) => sum + (pt.parametros?.comprimento || 0), 0);
    const capacidadeTotal = pontesTuneis.reduce((sum, pt) => sum + (pt.parametros?.capacidade_carga || 0), 0);
    
    const taxaOperacional = total > 0 ? ((operacionais / total) * 100).toFixed(1) : "0";
    
    return {
      total,
      pontes,
      tuneis,
      ativas,
      emManutencao,
      operacionais,
      comprimentoTotal,
      capacidadeTotal,
      taxaOperacional
    };
  }

  private calcularEstatisticasInspecaoPontesTuneis(inspecoes: InspecaoPontesTuneis[]) {
    const total = inspecoes.length;
    const conformes = inspecoes.filter(i => i.resultado === 'CONFORME').length;
    const naoConformes = inspecoes.filter(i => i.resultado === 'NAO_CONFORME').length;
    const pendentes = inspecoes.filter(i => i.resultado === 'PENDENTE').length;
    const criticos = inspecoes.filter(i => i.resultado === 'CRITICO').length;
    
    const inspecoesRutina = inspecoes.filter(i => i.tipo_inspecao === 'RUTINA').length;
    const inspecoesEspecial = inspecoes.filter(i => i.tipo_inspecao === 'ESPECIAL').length;
    const inspecoesEmergencia = inspecoes.filter(i => i.tipo_inspecao === 'EMERGENCIA').length;
    
    const taxaConformidade = total > 0 ? ((conformes / total) * 100).toFixed(1) : "0";
    
    return {
      total,
      conformes,
      naoConformes,
      pendentes,
      criticos,
      inspecoesRutina,
      inspecoesEspecial,
      inspecoesEmergencia,
      taxaConformidade
    };
  }

  private addEstatisticasPontesTuneis(stats: any, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Cards de estatísticas
    this.addKPICard(20, startY + 5, 'Total', stats.total.toString(), [59, 130, 246]);
    this.addKPICard(65, startY + 5, 'Pontes', stats.pontes.toString(), [34, 197, 94]);
    this.addKPICard(110, startY + 5, 'Túneis', stats.tuneis.toString(), [168, 85, 247]);
    this.addKPICard(155, startY + 5, 'Ativas', stats.ativas.toString(), [16, 185, 129]);
    
    // Segunda linha de cards
    this.addKPICard(20, startY + 30, 'Operacionais', stats.operacionais.toString(), [34, 197, 94]);
    this.addKPICard(65, startY + 30, 'Manutenção', stats.emManutencao.toString(), [251, 146, 60]);
    this.addKPICard(110, startY + 30, 'Taxa Op.', `${stats.taxaOperacional}%`, [59, 130, 246]);
    this.addKPICard(155, startY + 30, 'Comprimento', `${stats.comprimentoTotal}m`, [16, 185, 129]);
    
    return startY + 65;
  }

  private addEstatisticasInspecaoPontesTuneis(stats: any, startY: number): number {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Resumo Executivo', 20, startY);
    
    // Cards de estatísticas
    this.addKPICard(20, startY + 5, 'Total', stats.total.toString(), [59, 130, 246]);
    this.addKPICard(65, startY + 5, 'Conformes', stats.conformes.toString(), [34, 197, 94]);
    this.addKPICard(110, startY + 5, 'Não Conformes', stats.naoConformes.toString(), [239, 68, 68]);
    this.addKPICard(155, startY + 5, 'Pendentes', stats.pendentes.toString(), [251, 146, 60]);
    
    // Segunda linha de cards
    this.addKPICard(20, startY + 30, 'Críticos', stats.criticos.toString(), [239, 68, 68]);
    this.addKPICard(65, startY + 30, 'Rutina', stats.inspecoesRutina.toString(), [34, 197, 94]);
    this.addKPICard(110, startY + 30, 'Especial', stats.inspecoesEspecial.toString(), [168, 85, 247]);
    this.addKPICard(155, startY + 30, 'Taxa Conf.', `${stats.taxaConformidade}%`, [59, 130, 246]);
    
    return startY + 65;
  }

  public gerarRelatorioPontesTuneis(options: RelatorioPontesTuneisOptions): void {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo || 'Relatório de Pontes e Túneis', options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoPontesTuneis(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoPontesTuneis(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoPontesTuneis(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualPontesTuneis(options);
        break;
    }

    this.doc.save(`relatorio_pontes_tuneis_${options.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Métodos auxiliares para relatórios de Pontes e Túneis
  private addRelatorioExecutivoPontesTuneis(options: RelatorioPontesTuneisOptions, startY: number): number {
    const pontesTuneis = options.pontesTuneis || [];
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Tipo de Infraestrutura', 20, startY);
    
    // Análise por tipo
    const analisePorTipo = pontesTuneis.reduce((acc, pt) => {
      acc[pt.tipo] = (acc[pt.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tableData = Object.entries(analisePorTipo).map(([tipo, quantidade]) => [
      tipo,
      quantidade.toString(),
      `${((quantidade / pontesTuneis.length) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioIndividualPontesTuneis(options: RelatorioPontesTuneisOptions, startY: number): number {
    const pontesTuneis = options.pontesTuneis || [];
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes das Infraestruturas', 20, startY);
    
    // Preparar dados para tabela
    const tableData = pontesTuneis.map(pt => [
      pt.codigo,
      pt.tipo,
      pt.categoria,
      pt.localizacao,
      `${pt.km_inicial} - ${pt.km_final}`,
      pt.estado,
      pt.status_operacional,
      pt.fabricante,
      new Date(pt.data_construcao).toLocaleDateString("pt-PT")
    ]);
    
    // Adicionar tabela
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Tipo', 'Categoria', 'Localização', 'KM', 'Estado', 'Status', 'Fabricante', 'Data Const.']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioFiltradoPontesTuneis(options: RelatorioPontesTuneisOptions, startY: number): number {
    const pontesTuneis = options.pontesTuneis || [];
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Infraestruturas Filtradas', 20, startY);
    
    // Preparar dados para tabela
    const tableData = pontesTuneis.map(pt => [
      pt.codigo,
      pt.tipo,
      pt.categoria,
      pt.localizacao,
      pt.estado,
      pt.status_operacional,
      pt.fabricante,
      pt.responsavel
    ]);
    
    // Adicionar tabela
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Código', 'Tipo', 'Categoria', 'Localização', 'Estado', 'Status', 'Fabricante', 'Responsável']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoPontesTuneis(options: RelatorioPontesTuneisOptions, startY: number): number {
    const pontesTuneis = options.pontesTuneis || [];
    
    // Análise por estado
    const analisePorEstado = pontesTuneis.reduce((acc, pt) => {
      acc[pt.estado] = (acc[pt.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por categoria
    const analisePorCategoria = pontesTuneis.reduce((acc, pt) => {
      acc[pt.categoria] = (acc[pt.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);

    let currentY = startY + 15;

    // Análise por estado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Estado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorEstado).forEach(([estado, quantidade]) => {
      this.doc.text(`${estado}: ${quantidade} infraestruturas`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por categoria
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Categoria:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorCategoria).forEach(([categoria, quantidade]) => {
      this.doc.text(`${categoria}: ${quantidade} infraestruturas`, 25, currentY);
      currentY += 6;
    });

    return currentY;
  }

  // Métodos auxiliares para relatórios de Inspeções de Pontes e Túneis
  private addRelatorioExecutivoInspecaoPontesTuneis(options: RelatorioInspecaoPontesTuneisOptions, startY: number): number {
    const inspecoes = options.inspecoes || [];
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Tipo de Inspeção', 20, startY);
    
    // Análise por tipo
    const analisePorTipo = inspecoes.reduce((acc, ins) => {
      acc[ins.tipo_inspecao] = (acc[ins.tipo_inspecao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const tableData = Object.entries(analisePorTipo).map(([tipo, quantidade]) => [
      tipo,
      quantidade.toString(),
      `${((quantidade / inspecoes.length) * 100).toFixed(1)}%`
    ]);
    
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Tipo', 'Quantidade', 'Percentual']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioIndividualInspecaoPontesTuneis(options: RelatorioInspecaoPontesTuneisOptions, startY: number): number {
    const inspecoes = options.inspecoes || [];
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes das Inspeções', 20, startY);
    
    // Preparar dados para tabela
    const tableData = inspecoes.map(ins => [
      ins.ponte_tunel_id,
      ins.tipo_inspecao,
      ins.resultado,
      ins.responsavel,
      new Date(ins.data_inspecao).toLocaleDateString("pt-PT"),
      new Date(ins.proxima_inspecao).toLocaleDateString("pt-PT")
    ]);
    
    // Adicionar tabela
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Infraestrutura', 'Tipo', 'Resultado', 'Responsável', 'Data Inspeção', 'Próxima Inspeção']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioFiltradoInspecaoPontesTuneis(options: RelatorioInspecaoPontesTuneisOptions, startY: number): number {
    const inspecoes = options.inspecoes || [];
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Inspeções Filtradas', 20, startY);
    
    // Preparar dados para tabela
    const tableData = inspecoes.map(ins => [
      ins.ponte_tunel_id,
      ins.tipo_inspecao,
      ins.resultado,
      ins.responsavel,
      new Date(ins.data_inspecao).toLocaleDateString("pt-PT")
    ]);
    
    // Adicionar tabela
    autoTable(this.doc, {
      startY: startY + 8,
      head: [['Infraestrutura', 'Tipo', 'Resultado', 'Responsável', 'Data']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoInspecaoPontesTuneis(options: RelatorioInspecaoPontesTuneisOptions, startY: number): number {
    const inspecoes = options.inspecoes || [];
    
    // Análise por resultado
    const analisePorResultado = inspecoes.reduce((acc, ins) => {
      acc[ins.resultado] = (acc[ins.resultado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por tipo
    const analisePorTipo = inspecoes.reduce((acc, ins) => {
      acc[ins.tipo_inspecao] = (acc[ins.tipo_inspecao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);

    let currentY = startY + 15;

    // Análise por resultado
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Resultado:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorResultado).forEach(([resultado, quantidade]) => {
      this.doc.text(`${resultado}: ${quantidade} inspeções`, 25, currentY);
      currentY += 6;
    });

    currentY += 10;

    // Análise por tipo
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Tipo:', 20, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    Object.entries(analisePorTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade} inspeções`, 25, currentY);
      currentY += 6;
    });

    return currentY;
  }

  public gerarRelatorioInspecaoPontesTuneis(options: RelatorioInspecaoPontesTuneisOptions): void {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo || 'Relatório de Inspeções - Pontes e Túneis', options.subtitulo);
    this.addProfessionalFooter();

    switch (options.tipo) {
      case 'executivo':
        this.gerarRelatorioExecutivoInspecaoPontesTuneis(options);
        break;
      case 'filtrado':
        this.gerarRelatorioFiltradoInspecaoPontesTuneis(options);
        break;
      case 'comparativo':
        this.gerarRelatorioComparativoInspecaoPontesTuneis(options);
        break;
      case 'individual':
        this.gerarRelatorioIndividualInspecaoPontesTuneis(options);
        break;
    }

    this.doc.save(`relatorio_inspecao_pontes_tuneis_${options.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Métodos para Calibrações e Equipamentos
  async gerarRelatorioExecutivoCalibracoesEquipamentos(options: any): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    // Estatísticas principais
    const stats = options.stats;
    let currentY = 100;

    // Título da seção
    this.doc.setFillColor(147, 51, 234);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resumo Executivo - Calibrações e Equipamentos', 20, currentY + 2);

    currentY += 20;

    // Estatísticas principais
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Principais:', 20, currentY);

    currentY += 15;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const estatisticas = [
      `Total de Equipamentos: ${stats?.total_equipamentos || 0}`,
      `Equipamentos Ativos: ${stats?.equipamentos_ativos || 0}`,
      `Calibrações Vencidas: ${stats?.calibracoes_vencidas || 0}`,
      `Calibrações Próximas de Vencer: ${stats?.calibracoes_proximas_vencer || 0}`,
      `Valor Total dos Equipamentos: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats?.valor_total_equipamentos || 0)}`,
      `Custos de Calibrações: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats?.custo_total_calibracoes || 0)}`,
      `Custos de Manutenções: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats?.custo_total_manutencoes || 0)}`
    ];

    estatisticas.forEach((stat, index) => {
      this.doc.text(stat, 20, currentY + (index * 6));
    });

    currentY += estatisticas.length * 6 + 20;

    // Tabela de equipamentos (primeiros 10)
    if (options.equipamentos && options.equipamentos.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Equipamentos Principais:', 20, currentY);

      currentY += 15;

      const equipamentosParaTabela = options.equipamentos.slice(0, 10).map((equip: any) => [
        equip.codigo || '',
        equip.nome || '',
        equip.status_operacional || '',
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(equip.valor_atual || 0)
      ]);

      autoTable(this.doc, {
        startY: currentY,
        head: [['Código', 'Nome', 'Status', 'Valor']],
        body: equipamentosParaTabela,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234], textColor: 255 },
        styles: { fontSize: 8 }
      });

      currentY = (this.doc as any).lastAutoTable.finalY + 15;
    }

    this.doc.save(`relatorio_executivo_calibracoes_equipamentos_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async gerarRelatorioEquipamentos(options: any): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    let currentY = 100;

    // Título da seção
    this.doc.setFillColor(147, 51, 234);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Relatório de Equipamentos', 20, currentY + 2);

    currentY += 20;

    if (options.equipamentos && options.equipamentos.length > 0) {
      const equipamentosParaTabela = options.equipamentos.map((equip: any) => [
        equip.codigo || '',
        equip.nome || '',
        equip.tipo || '',
        equip.categoria || '',
        equip.status_operacional || '',
        equip.responsavel || '',
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(equip.valor_atual || 0)
      ]);

      autoTable(this.doc, {
        startY: currentY,
        head: [['Código', 'Nome', 'Tipo', 'Categoria', 'Status', 'Responsável', 'Valor']],
        body: equipamentosParaTabela,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234], textColor: 255 },
        styles: { fontSize: 8 }
      });
    }

    this.doc.save(`relatorio_equipamentos_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async gerarRelatorioCalibracoes(options: any): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    let currentY = 100;

    // Título da seção
    this.doc.setFillColor(147, 51, 234);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Relatório de Calibrações', 20, currentY + 2);

    currentY += 20;

    if (options.calibracoes && options.calibracoes.length > 0) {
      const calibracoesParaTabela = options.calibracoes.map((cal: any) => [
        cal.numero_calibracao || '',
        cal.equipamento_id || '',
        cal.tipo_calibracao || '',
        cal.resultado || '',
        new Date(cal.data_calibracao).toLocaleDateString('pt-PT'),
        new Date(cal.data_proxima_calibracao).toLocaleDateString('pt-PT'),
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(cal.custo || 0)
      ]);

      autoTable(this.doc, {
        startY: currentY,
        head: [['Número', 'Equipamento', 'Tipo', 'Resultado', 'Data', 'Próxima', 'Custo']],
        body: calibracoesParaTabela,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234], textColor: 255 },
        styles: { fontSize: 8 }
      });
    }

    this.doc.save(`relatorio_calibracoes_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async gerarRelatorioManutencoes(options: any): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    let currentY = 100;

    // Título da seção
    this.doc.setFillColor(147, 51, 234);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Relatório de Manutenções', 20, currentY + 2);

    currentY += 20;

    if (options.manutencoes && options.manutencoes.length > 0) {
      const manutencoesParaTabela = options.manutencoes.map((man: any) => [
        man.numero_manutencao || '',
        man.equipamento_id || '',
        man.tipo_manutencao || '',
        man.descricao || '',
        new Date(man.data_inicio).toLocaleDateString('pt-PT'),
        new Date(man.data_fim).toLocaleDateString('pt-PT'),
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(man.custo || 0)
      ]);

      autoTable(this.doc, {
        startY: currentY,
        head: [['Número', 'Equipamento', 'Tipo', 'Descrição', 'Início', 'Fim', 'Custo']],
        body: manutencoesParaTabela,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234], textColor: 255 },
        styles: { fontSize: 8 }
      });
    }

    this.doc.save(`relatorio_manutencoes_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async gerarRelatorioInspecoes(options: any): Promise<void> {
    this.doc = new jsPDF();
    this.pageNumber = 1;
    this.totalPages = 1;

    this.addProfessionalHeader(options.titulo, options.subtitulo);
    this.addProfessionalFooter();

    let currentY = 100;

    // Título da seção
    this.doc.setFillColor(147, 51, 234);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Relatório de Inspeções', 20, currentY + 2);

    currentY += 20;

    if (options.inspecoes && options.inspecoes.length > 0) {
      const inspecoesParaTabela = options.inspecoes.map((insp: any) => [
        insp.numero_inspecao || '',
        insp.equipamento_id || '',
        insp.tipo_inspecao || '',
        insp.resultado || '',
        new Date(insp.data_inspecao).toLocaleDateString('pt-PT'),
        insp.responsavel || '',
        insp.observacoes || ''
      ]);

      autoTable(this.doc, {
        startY: currentY,
        head: [['Número', 'Equipamento', 'Tipo', 'Resultado', 'Data', 'Responsável', 'Observações']],
        body: inspecoesParaTabela,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234], textColor: 255 },
        styles: { fontSize: 8 }
      });
    }

    this.doc.save(`relatorio_inspecoes_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // ===== MÉTODOS PARA RELATÓRIOS DE SOLOS =====
  
  public async generateSolosExecutiveReport(solos: any[]): Promise<void> {
    console.log('PDFService: Iniciando relatório executivo de solos com', solos.length, 'solos');
    
    try {
      const options: RelatorioSolosOptions = {
        titulo: 'Relatório Executivo de Caracterização de Solos',
        subtitulo: 'Visão Geral e Indicadores de Conformidade',
        solos,
        tipo: 'executivo'
      };
      
      console.log('PDFService: Gerando relatório...');
      this.gerarRelatorioExecutivoSolos(options);
      
      console.log('PDFService: Fazendo download...');
      this.download(`relatorio-solos-executivo-${new Date().toISOString().split('T')[0]}.pdf`);
      
      console.log('PDFService: Relatório executivo concluído!');
    } catch (error) {
      console.error('PDFService: Erro no relatório executivo:', error);
      throw error;
    }
  }

  public async generateSolosFilteredReport(solos: any[], filtros: any): Promise<void> {
    const options: RelatorioSolosOptions = {
      titulo: 'Relatório Filtrado de Caracterização de Solos',
      subtitulo: 'Análise Detalhada com Filtros Aplicados',
      solos,
      tipo: 'filtrado',
      filtros
    };
    this.gerarRelatorioFiltradoSolos(options);
    this.download(`relatorio-solos-filtrado-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateSolosComparativeReport(solos: any[]): Promise<void> {
    const options: RelatorioSolosOptions = {
      titulo: 'Relatório Comparativo de Caracterização de Solos',
      subtitulo: 'Análise Comparativa e Benchmarks',
      solos,
      tipo: 'comparativo'
    };
    this.gerarRelatorioComparativoSolos(options);
    this.download(`relatorio-solos-comparativo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public async generateSolosIndividualReport(solos: any[]): Promise<void> {
    if (solos.length !== 1) {
      throw new Error('Relatório individual deve conter apenas um solo');
    }
    
    const solo = solos[0];
    const options: RelatorioSolosOptions = {
      titulo: `Relatório Individual - Caracterização de Solo`,
      subtitulo: `Código: ${solo.codigo} | Obra: ${solo.obra}`,
      solos,
      tipo: 'individual'
    };
    this.gerarRelatorioIndividualSolo(options);
    this.download(`relatorio-solos-individual-${solo.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private gerarRelatorioExecutivoSolos(options: RelatorioSolosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addEstatisticasSolos(options.solos, startY);
    currentY = this.addRelatorioExecutivoSolos(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioFiltradoSolos(options: RelatorioSolosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addFiltrosSolos(options.filtros, startY);
    currentY = this.addRelatorioFiltradoSolos(options, currentY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioComparativoSolos(options: RelatorioSolosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoSolos(options, startY);
    
    this.addProfessionalFooter();
  }

  private gerarRelatorioIndividualSolo(options: RelatorioSolosOptions): void {
    this.doc = new jsPDF();
    this.addProfessionalHeader(options.titulo, options.subtitulo);
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualSolo(options, startY);
    
    this.addProfessionalFooter();
  }

  private addEstatisticasSolos(solos: any[], startY: number): number {
    let currentY = startY;

    // Título da seção
    this.doc.setFillColor(34, 197, 94); // Verde
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Estatísticas Gerais', 20, currentY + 2);

    currentY += 20;

    // Calcular estatísticas
    const total = solos.length;
    const conformes = solos.filter(s => s.conforme).length;
    const nao_conformes = total - conformes;
    const adequados = solos.filter(s => s.classificacao && s.classificacao.adequacao && 
      (s.classificacao.adequacao === 'ADEQUADO' || s.classificacao.adequacao === 'EXCELENTE')).length;
    const inadequados = total - adequados;
    const percentual_conformidade = total > 0 ? (conformes / total) * 100 : 0;
    const laboratorios_unicos = new Set(solos.map(s => s.laboratorio)).size;

    // Estatísticas em grid
    const stats = [
      { label: 'Total de Solos', value: total, color: [59, 130, 246] },
      { label: 'Conformes', value: conformes, color: [34, 197, 94] },
      { label: 'Não Conformes', value: nao_conformes, color: [239, 68, 68] },
      { label: 'Adequados', value: adequados, color: [59, 130, 246] },
      { label: 'Inadequados', value: inadequados, color: [245, 158, 11] },
      { label: 'Taxa Conformidade', value: `${percentual_conformidade.toFixed(1)}%`, color: [147, 51, 234] },
      { label: 'Laboratórios', value: laboratorios_unicos, color: [236, 72, 153] }
    ];

    let x = 20;
    let y = currentY;
    const boxWidth = 55;
    const boxHeight = 25;

    stats.forEach((stat, index) => {
      if (index > 0 && index % 3 === 0) {
        y += 35;
        x = 20;
      }

      // Fundo colorido
      this.doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      this.doc.rect(x, y, boxWidth, boxHeight, 'F');

      // Texto
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(stat.label, x + 2, y + 8);

      this.doc.setFontSize(12);
      this.doc.text(stat.value.toString(), x + 2, y + 18);

      x += 60;
    });

    return y + 40;
  }

  private addRelatorioExecutivoSolos(options: RelatorioSolosOptions, startY: number): number {
    let currentY = startY;

    // Análise por adequação
    this.doc.setFillColor(34, 197, 94);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Análise por Adequação', 20, currentY + 2);

    currentY += 20;

    const adequacaoStats = this.calcularEstatisticasAdequacao(options.solos);
    const adequacaoData = Object.entries(adequacaoStats).map(([adequacao, count]) => [adequacao, count.toString()]);

    autoTable(this.doc, {
      startY: currentY,
      head: [['Adequação', 'Quantidade']],
      body: adequacaoData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 10 }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Análise por laboratório
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Análise por Laboratório', 20, currentY + 2);

    currentY += 20;

    const laboratorioStats = this.calcularEstatisticasLaboratorio(options.solos);
    const laboratorioData = Object.entries(laboratorioStats).map(([lab, stats]) => [
      lab, 
      stats.total.toString(), 
      stats.conformes.toString(), 
      `${((stats.conformes / stats.total) * 100).toFixed(1)}%`
    ]);

    autoTable(this.doc, {
      startY: currentY,
      head: [['Laboratório', 'Total', 'Conformes', '% Conformidade']],
      body: laboratorioData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 9 }
    });

    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addFiltrosSolos(filtros: any, startY: number): number {
    let currentY = startY;

    this.doc.setFillColor(245, 158, 11);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Filtros Aplicados', 20, currentY + 2);

    currentY += 20;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);

    const filtrosAplicados = [];
    if (filtros.obra) filtrosAplicados.push(['Obra', filtros.obra]);
    if (filtros.laboratorio) filtrosAplicados.push(['Laboratório', filtros.laboratorio]);
    if (filtros.conforme !== '') filtrosAplicados.push(['Conformidade', filtros.conforme === 'true' ? 'Conformes' : 'Não Conformes']);
    if (filtros.adequacao) filtrosAplicados.push(['Adequação', filtros.adequacao]);
    if (filtros.dataInicio && filtros.dataFim) filtrosAplicados.push(['Período', `${filtros.dataInicio} a ${filtros.dataFim}`]);

    if (filtrosAplicados.length > 0) {
      autoTable(this.doc, {
        startY: currentY,
        head: [['Filtro', 'Valor']],
        body: filtrosAplicados,
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11], textColor: 255 },
        styles: { fontSize: 10 }
      });
      currentY = (this.doc as any).lastAutoTable.finalY + 15;
    } else {
      this.doc.text('Nenhum filtro aplicado', 20, currentY);
      currentY += 10;
    }

    return currentY;
  }

  private addRelatorioFiltradoSolos(options: RelatorioSolosOptions, startY: number): number {
    let currentY = startY;

    // Tabela de dados filtrados
    this.doc.setFillColor(34, 197, 94);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Dados Filtrados', 20, currentY + 2);

    currentY += 20;

    const dadosParaTabela = options.solos.map(solo => [
      solo.codigo || '',
      solo.obra || '',
      solo.localizacao || '',
      solo.laboratorio || '',
      new Date(solo.data_colheita).toLocaleDateString('pt-PT'),
      solo.classificacao?.adequacao || 'N/A',
      solo.conforme ? 'Sim' : 'Não'
    ]);

    autoTable(this.doc, {
      startY: currentY,
      head: [['Código', 'Obra', 'Localização', 'Laboratório', 'Data Colheita', 'Adequação', 'Conforme']],
      body: dadosParaTabela,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 8 }
    });

    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioComparativoSolos(options: RelatorioSolosOptions, startY: number): number {
    let currentY = startY;

    // Comparação por adequação
    this.doc.setFillColor(147, 51, 234);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Comparação por Adequação', 20, currentY + 2);

    currentY += 20;

    const adequacaoStats = this.calcularEstatisticasAdequacao(options.solos);
    const adequacaoData = Object.entries(adequacaoStats).map(([adequacao, count]) => [
      adequacao, 
      count.toString(), 
      `${((count / options.solos.length) * 100).toFixed(1)}%`
    ]);

    autoTable(this.doc, {
      startY: currentY,
      head: [['Adequação', 'Quantidade', 'Percentagem']],
      body: adequacaoData,
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      styles: { fontSize: 10 }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Comparação por laboratório
    this.doc.setFillColor(236, 72, 153);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Comparação por Laboratório', 20, currentY + 2);

    currentY += 20;

    const laboratorioStats = this.calcularEstatisticasLaboratorio(options.solos);
    const laboratorioData = Object.entries(laboratorioStats).map(([lab, stats]) => [
      lab, 
      stats.total.toString(), 
      stats.conformes.toString(), 
      stats.nao_conformes.toString(),
      `${((stats.conformes / stats.total) * 100).toFixed(1)}%`
    ]);

    autoTable(this.doc, {
      startY: currentY,
      head: [['Laboratório', 'Total', 'Conformes', 'Não Conformes', '% Conformidade']],
      body: laboratorioData,
      theme: 'grid',
      headStyles: { fillColor: [236, 72, 153], textColor: 255 },
      styles: { fontSize: 9 }
    });

    return (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addRelatorioIndividualSolo(options: RelatorioSolosOptions, startY: number): number {
    const solo = options.solos[0];
    let currentY = startY;

    // Informações gerais
    this.doc.setFillColor(34, 197, 94);
    this.doc.rect(15, currentY - 5, 180, 10, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Informações Gerais', 20, currentY + 2);

    currentY += 20;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);

    const infoGeral = [
      ['Código', solo.codigo || ''],
      ['Obra', solo.obra || ''],
      ['Localização', solo.localizacao || ''],
      ['Laboratório', solo.laboratorio || ''],
      ['Data de Colheita', new Date(solo.data_colheita).toLocaleDateString('pt-PT')],
      ['Tipo de Amostra', solo.tipo_amostra || ''],
      ['Profundidade de Colheita', `${solo.profundidade_colheita || 0} m`],
      ['Conforme', solo.conforme ? 'Sim' : 'Não']
    ];

    autoTable(this.doc, {
      startY: currentY,
      head: [['Campo', 'Valor']],
      body: infoGeral,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 10 }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Classificação
    if (solo.classificacao) {
      this.doc.setFillColor(59, 130, 246);
      this.doc.rect(15, currentY - 5, 180, 10, 'F');
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(255, 255, 255);
      this.doc.text('Classificação', 20, currentY + 2);

      currentY += 20;

      const classificacaoData = [
        ['Adequação', solo.classificacao.adequacao || 'N/A'],
        ['Descrição', solo.classificacao.descricao || 'N/A']
      ];

      autoTable(this.doc, {
        startY: currentY,
        head: [['Campo', 'Valor']],
        body: classificacaoData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 10 }
      });

      currentY = (this.doc as any).lastAutoTable.finalY + 15;
    }

    return currentY;
  }

  private calcularEstatisticasAdequacao(solos: any[]): Record<string, number> {
    const stats: Record<string, number> = {};
    
    solos.forEach(solo => {
      const adequacao = solo.classificacao?.adequacao || 'N/A';
      stats[adequacao] = (stats[adequacao] || 0) + 1;
    });
    
    return stats;
  }

  private calcularEstatisticasLaboratorio(solos: any[]): Record<string, { total: number; conformes: number; nao_conformes: number }> {
    const stats: Record<string, { total: number; conformes: number; nao_conformes: number }> = {};
    
    solos.forEach(solo => {
      const lab = solo.laboratorio || 'N/A';
      if (!stats[lab]) {
        stats[lab] = { total: 0, conformes: 0, nao_conformes: 0 };
      }
      stats[lab].total++;
      if (solo.conforme) {
        stats[lab].conformes++;
      } else {
        stats[lab].nao_conformes++;
      }
    });
    
    return stats;
  }
}

export default PDFService; 