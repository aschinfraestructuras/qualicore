import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MetricasReais } from './metricsService';
import { Material, Obra, Ensaio } from '@/types';

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

export class PDFService {
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
    this.doc.rect(15, startY - 5, 180, 12, 'F');
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Ficha Técnica da Obra', 20, startY + 3);
    
    // Status card colorido
    const statusColors = {
      'em_execucao': [34, 197, 94], // Verde
      'concluida': [16, 185, 129], // Verde escuro
      'paralisada': [245, 158, 11], // Amarelo
      'cancelada': [239, 68, 68], // Vermelho
      'planeamento': [168, 85, 247] // Roxo
    };
    
    const statusColor = statusColors[obra.status] || [107, 114, 128];
    this.addStatusCard(150, startY - 5, this.getStatusTextObra(obra.status), statusColor);
    
    // KPIs da obra
    const kpiY = startY + 15;
    this.addKPICard(20, kpiY, 'Valor Contrato', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato), [59, 130, 246]); // Azul
    this.addKPICard(65, kpiY, 'Valor Executado', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_executado), [34, 197, 94]); // Verde
    this.addKPICard(110, kpiY, 'Progresso', `${obra.percentual_execucao}%`, [251, 146, 60]); // Laranja
    
    // Informações básicas com seção colorida
    const infoY = kpiY + 35;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 50, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, infoY - 5, 180, 50);
    
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
    
    let currentY = infoY + 15;
    infoBasicas.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Datas e valores com seção colorida
    const datasY = infoY + 55;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, datasY - 5, 180, 45, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, datasY - 5, 180, 45);
    
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
    
    currentY = datasY + 15;
    datasValores.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Equipa técnica com seção colorida
    const equipaY = datasY + 50;
    this.doc.setFillColor(240, 249, 255); // Azul claro
    this.doc.rect(15, equipaY - 5, 180, 40, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, equipaY - 5, 180, 40);
    
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
    
    currentY = equipaY + 15;
    equipaTecnica.forEach(item => {
      this.doc.text(item, 25, currentY);
      currentY += 6;
    });
    
    // Observações com seção colorida
    if (obra.observacoes) {
      const obsY = equipaY + 45;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, obsY - 5, 180, 30, 'F');
      this.doc.setDrawColor(229, 231, 235);
      this.doc.rect(15, obsY - 5, 180, 30);
      
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
      
      return currentY + 15;
    }
    
    return equipaY + 50;
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
    
    // Informações básicas com seção colorida
    const infoY = kpiY + 35;
    this.doc.setFillColor(249, 250, 251); // Cinza claro
    this.doc.rect(15, infoY - 5, 180, 45, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, infoY - 5, 180, 45);
    
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
    
    // Resultados com seção colorida
    const resultadosY = infoY + 55;
    this.doc.setFillColor(254, 242, 242); // Vermelho claro
    this.doc.rect(15, resultadosY - 5, 180, 45, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, resultadosY - 5, 180, 45);
    
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
    
    // Observações com seção colorida
    if (ensaio.observacoes) {
      const obsY = resultadosY + 50;
      this.doc.setFillColor(254, 251, 235); // Amarelo claro
      this.doc.rect(15, obsY - 5, 180, 30, 'F');
      this.doc.setDrawColor(229, 231, 235);
      this.doc.rect(15, obsY - 5, 180, 30);
      
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
      
      return currentY + 15;
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
}

export const pdfService = new PDFService(); 