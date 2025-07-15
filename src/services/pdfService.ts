import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MetricasReais } from './metricsService';
import { Material } from '@/types';

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
    
    return startY + 55;
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
}

export const pdfService = new PDFService(); 