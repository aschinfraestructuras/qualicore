import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MetricasReais } from './metricsService';

export interface PrintOptions {
  titulo: string;
  subtitulo?: string;
  tipo: 'executivo' | 'detalhado' | 'comparativo' | 'individual';
  modulo: 'geral' | 'ensaios' | 'checklists' | 'materiais' | 'ncs' | 'documentos' | 'fornecedores' | 'obras';
  metricas?: MetricasReais;
  dados?: any[];
  filtros?: any;
  orientacao?: 'portrait' | 'landscape';
  tamanho?: 'a4' | 'a3' | 'letter';
  incluirGraficos?: boolean;
  incluirTabelas?: boolean;
  incluirKPIs?: boolean;
}

export class PrintService {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  // Método principal para imprimir qualquer relatório
  public async printRelatorio(options: PrintOptions): Promise<void> {
    try {
      this.doc = new jsPDF(options.orientacao || 'portrait', 'mm', options.tamanho || 'a4');
      
      // Adicionar header profissional
      this.addProfessionalHeader(options.titulo, options.subtitulo);
      
      const startY = 90;
      let currentY = startY;

      // Adicionar KPIs se solicitado
      if (options.incluirKPIs && options.metricas) {
        currentY = this.addKPIsSection(options.metricas, options.modulo, currentY);
        currentY += 20;
      }

      // Adicionar conteúdo baseado no tipo
      switch (options.tipo) {
        case 'executivo':
          currentY = this.addRelatorioExecutivo(options, currentY);
          break;
        case 'detalhado':
          currentY = this.addRelatorioDetalhado(options, currentY);
          break;
        case 'comparativo':
          currentY = this.addRelatorioComparativo(options, currentY);
          break;
        case 'individual':
          currentY = this.addRelatorioIndividual(options, currentY);
          break;
      }

      // Adicionar footer profissional
      this.addProfessionalFooter();

      // Verificar se precisa de nova página
      if (currentY > this.doc.internal.pageSize.height - 50) {
        this.doc.addPage();
        this.addProfessionalHeader(options.titulo, options.subtitulo);
        this.addProfessionalFooter();
      }

      // Imprimir
      this.doc.autoPrint();
      this.doc.output('dataurlnewwindow');
      
    } catch (error) {
      console.error('Erro ao gerar relatório para impressão:', error);
      throw error;
    }
  }

  // Método para imprimir página atual do navegador
  public printCurrentPage(): void {
    // Adicionar CSS de impressão dinamicamente
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @media print {
        /* Esconder elementos desnecessários */
        .no-print, .sidebar, .navbar, button, .btn {
          display: none !important;
        }
        
        /* Layout otimizado para impressão */
        body {
          margin: 0;
          padding: 20px;
          font-size: 12px;
          line-height: 1.4;
        }
        
        /* Headers e footers */
        .print-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .print-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
          padding: 10px 20px;
          font-size: 10px;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        /* Conteúdo principal */
        .print-content {
          margin-top: 80px;
          margin-bottom: 60px;
        }
        
        /* Cards e KPIs */
        .card {
          break-inside: avoid;
          margin-bottom: 15px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
        }
        
        /* Tabelas */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          break-inside: avoid;
        }
        
        th, td {
          border: 1px solid #dee2e6;
          padding: 8px;
          text-align: left;
          font-size: 11px;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        
        /* Quebras de página */
        .page-break {
          page-break-before: always;
        }
        
        /* Cores para impressão */
        .text-success { color: #28a745 !important; }
        .text-danger { color: #dc3545 !important; }
        .text-warning { color: #ffc107 !important; }
        .text-info { color: #17a2b8 !important; }
        
        /* Gráficos e imagens */
        img, canvas {
          max-width: 100%;
          height: auto;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Adicionar header e footer temporários
    this.addPrintHeader();
    this.addPrintFooter();
    
    // Imprimir
    window.print();
    
    // Limpar após impressão
    setTimeout(() => {
      const printStyle = document.getElementById('print-styles');
      if (printStyle) {
        printStyle.remove();
      }
      this.removePrintElements();
    }, 1000);
  }

  // Método para imprimir relatório específico de módulo
  public async printModuloRelatorio(
    modulo: string,
    tipo: 'executivo' | 'detalhado' | 'comparativo' | 'individual',
    dados: any[],
    metricas?: MetricasReais
  ): Promise<void> {
    const options: PrintOptions = {
      titulo: `Relatório de ${this.getModuloTitle(modulo)}`,
      subtitulo: `${this.getTipoTitle(tipo)} - ${new Date().toLocaleDateString('pt-PT')}`,
      tipo,
      modulo: modulo as any,
      dados,
      metricas,
      incluirKPIs: true,
      incluirTabelas: true,
      incluirGraficos: tipo === 'comparativo'
    };

    await this.printRelatorio(options);
  }

  // Método para imprimir dashboard completo
  public async printDashboard(metricas: MetricasReais): Promise<void> {
    const options: PrintOptions = {
      titulo: 'Dashboard de Qualidade',
      subtitulo: `Relatório Executivo - ${new Date().toLocaleDateString('pt-PT')}`,
      tipo: 'executivo',
      modulo: 'geral',
      metricas,
      incluirKPIs: true,
      incluirGraficos: true,
      orientacao: 'landscape'
    };

    await this.printRelatorio(options);
  }

  // Métodos auxiliares privados
  private addProfessionalHeader(titulo: string, subtitulo?: string): void {
    // Logo da empresa (simulado)
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(15, 15, 40, 15, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('QUALICORE', 20, 25);

    // Título do relatório
    this.doc.setTextColor(31, 41, 55);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(titulo, 70, 25);

    // Subtítulo
    if (subtitulo) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);
      this.doc.text(subtitulo, 70, 35);
    }

    // Informações da empresa
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text('ASCH Infraestruturas, Lda.', 15, 50);
    this.doc.text('Sistema de Gestão da Qualidade', 15, 55);
    this.doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 15, 60);
  }

  private addProfessionalFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128);
    this.doc.setFont('helvetica', 'normal');
    
    // Linha separadora
    this.doc.setDrawColor(229, 231, 235);
    this.doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
    
    // Informações do footer
    this.doc.text('Qualicore - Sistema de Gestão da Qualidade', 15, pageHeight - 15);
    this.doc.text(`Página ${this.doc.getCurrentPageInfo().pageNumber}`, pageWidth - 40, pageHeight - 15);
  }

  private addKPIsSection(metricas: MetricasReais, modulo: string, startY: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Indicadores de Performance', 20, startY);

    const kpiY = startY + 15;
    let currentY = kpiY;

    // KPIs específicos do módulo
    switch (modulo) {
      case 'geral':
        this.addKPICard(20, currentY, 'Conformidade Geral', `${metricas.geral.conformidade_geral}%`, [34, 197, 94]);
        this.addKPICard(65, currentY, 'Total Registos', metricas.geral.total_registros.toString(), [59, 130, 246]);
        this.addKPICard(110, currentY, 'Alertas Críticos', metricas.geral.alertas_criticos.toString(), [239, 68, 68]);
        currentY += 25;
        break;
      
      case 'ensaios':
        this.addKPICard(20, currentY, 'Taxa Conformidade', `${metricas.ensaios.taxa_conformidade}%`, [34, 197, 94]);
        this.addKPICard(65, currentY, 'Total Ensaios', metricas.ensaios.total_ensaios.toString(), [59, 130, 246]);
        this.addKPICard(110, currentY, 'Não Conformes', metricas.ensaios.ensaios_nao_conformes.toString(), [239, 68, 68]);
        currentY += 25;
        break;
      
      case 'checklists':
        this.addKPICard(20, currentY, 'Conformidade Média', `${metricas.checklists.conformidade_media}%`, [34, 197, 94]);
        this.addKPICard(65, currentY, 'Total Checklists', metricas.checklists.total_checklists.toString(), [59, 130, 246]);
        this.addKPICard(110, currentY, 'Pendentes', metricas.checklists.checklists_pendentes.toString(), [245, 158, 11]);
        currentY += 25;
        break;
      
      case 'materiais':
        this.addKPICard(20, currentY, 'Taxa Aprovação', `${metricas.materiais.taxa_aprovacao}%`, [34, 197, 94]);
        this.addKPICard(65, currentY, 'Total Materiais', metricas.materiais.total_materiais.toString(), [59, 130, 246]);
        this.addKPICard(110, currentY, 'Pendentes', metricas.materiais.materiais_pendentes.toString(), [245, 158, 11]);
        currentY += 25;
        break;
      
      case 'ncs':
        this.addKPICard(20, currentY, 'Taxa Resolução', `${metricas.naoConformidades.taxa_resolucao}%`, [34, 197, 94]);
        this.addKPICard(65, currentY, 'Total NCs', metricas.naoConformidades.total_ncs.toString(), [59, 130, 246]);
        this.addKPICard(110, currentY, 'Pendentes', metricas.naoConformidades.ncs_pendentes.toString(), [239, 68, 68]);
        currentY += 25;
        break;
      
      case 'documentos':
        this.addKPICard(20, currentY, 'Total Documentos', metricas.documentos.total_documentos.toString(), [59, 130, 246]);
        this.addKPICard(65, currentY, 'Aprovados', metricas.documentos.documentos_aprovados.toString(), [34, 197, 94]);
        this.addKPICard(110, currentY, 'Vencidos', metricas.documentos.documentos_vencidos.toString(), [239, 68, 68]);
        currentY += 25;
        break;
    }

    return currentY;
  }

  private addKPICard(x: number, y: number, titulo: string, valor: string, cor: number[]): void {
    // Fundo do card
    this.doc.setFillColor(cor[0], cor[1], cor[2]);
    this.doc.rect(x, y, 40, 20, 'F');
    
    // Valor
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(valor, x + 20, y + 8, { align: 'center' });
    
    // Título
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(titulo, x + 20, y + 15, { align: 'center' });
  }

  private addRelatorioExecutivo(options: PrintOptions, startY: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Executiva', 20, startY);

    // Resumo executivo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);

    const resumo = [
      `Este relatório apresenta uma análise executiva do módulo ${this.getModuloTitle(options.modulo)}.`,
      `Os dados foram analisados com base nos critérios estabelecidos no sistema de gestão da qualidade.`,
      `O período de análise abrange os registos mais recentes do sistema.`
    ];

    let currentY = startY + 10;
    resumo.forEach(paragrafo => {
      const linhas = this.doc.splitTextToSize(paragrafo, 170);
      this.doc.text(linhas, 20, currentY);
      currentY += linhas.length * 5 + 3;
    });

    return currentY + 20;
  }

  private addRelatorioDetalhado(options: PrintOptions, startY: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Detalhada', 20, startY);

    if (options.dados && options.dados.length > 0) {
      // Criar tabela com os dados
      const tableData = this.prepareTableData(options.dados, options.modulo);
      
      autoTable(this.doc, {
        startY: startY + 10,
        head: [this.getTableHeaders(options.modulo)],
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

    return startY + 20;
  }

  private addRelatorioComparativo(options: PrintOptions, startY: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);

    // Adicionar gráficos comparativos (simulados)
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('Gráficos comparativos serão incluídos na versão completa.', 20, startY + 15);

    return startY + 30;
  }

  private addRelatorioIndividual(options: PrintOptions, startY: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Ficha Individual', 20, startY);

    if (options.dados && options.dados.length === 1) {
      const item = options.dados[0];
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(75, 85, 99);

      const detalhes = this.getIndividualDetails(item, options.modulo);
      let currentY = startY + 10;

      detalhes.forEach(([label, value]) => {
        this.doc.text(`${label}: ${value}`, 20, currentY);
        currentY += 6;
      });

      return currentY + 10;
    }

    return startY + 20;
  }

  private addPrintHeader(): void {
    const header = document.createElement('div');
    header.className = 'print-header';
    header.innerHTML = `
      <div>
        <h1 style="margin: 0; font-size: 18px; color: #1f2937;">QUALICORE</h1>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">Sistema de Gestão da Qualidade</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">${new Date().toLocaleString('pt-PT')}</p>
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);
  }

  private addPrintFooter(): void {
    const footer = document.createElement('div');
    footer.className = 'print-footer';
    footer.innerHTML = `
      <div>ASCH Infraestruturas, Lda. - Qualicore</div>
      <div>Página <span class="page-number"></span></div>
    `;
    document.body.appendChild(footer);
  }

  private removePrintElements(): void {
    const header = document.querySelector('.print-header');
    const footer = document.querySelector('.print-footer');
    
    if (header) header.remove();
    if (footer) footer.remove();
  }

  // Métodos auxiliares para preparação de dados
  private prepareTableData(dados: any[], modulo: string): string[][] {
    return dados.slice(0, 20).map(item => {
      switch (modulo) {
        case 'ensaios':
          return [
            item.codigo || '',
            item.tipo || '',
            item.conforme ? 'Conforme' : 'Não Conforme',
            item.data_ensaio ? new Date(item.data_ensaio).toLocaleDateString('pt-PT') : '',
            item.laboratorio || ''
          ];
        case 'materiais':
          return [
            item.codigo || '',
            item.nome || '',
            item.tipo || '',
            item.estado || '',
            item.data_rececao ? new Date(item.data_rececao).toLocaleDateString('pt-PT') : ''
          ];
        case 'ncs':
          return [
            item.codigo || '',
            item.tipo || '',
            item.severidade || '',
            item.estado || '',
            item.data_deteccao ? new Date(item.data_deteccao).toLocaleDateString('pt-PT') : ''
          ];
        default:
          return [item.codigo || '', item.nome || '', item.estado || ''];
      }
    });
  }

  private getTableHeaders(modulo: string): string[] {
    switch (modulo) {
      case 'ensaios':
        return ['Código', 'Tipo', 'Status', 'Data', 'Laboratório'];
      case 'materiais':
        return ['Código', 'Nome', 'Tipo', 'Estado', 'Data Receção'];
      case 'ncs':
        return ['Código', 'Tipo', 'Severidade', 'Estado', 'Data Detecção'];
      default:
        return ['Código', 'Nome', 'Estado'];
    }
  }

  private getIndividualDetails(item: any, modulo: string): [string, string][] {
    switch (modulo) {
      case 'ensaios':
        return [
          ['Código', item.codigo || ''],
          ['Tipo', item.tipo || ''],
          ['Resultado', item.conforme ? 'Conforme' : 'Não Conforme'],
          ['Data', item.data_ensaio ? new Date(item.data_ensaio).toLocaleDateString('pt-PT') : ''],
          ['Laboratório', item.laboratorio || ''],
          ['Valor Obtido', item.valor_obtido?.toString() || ''],
          ['Valor Esperado', item.valor_esperado?.toString() || '']
        ];
      case 'materiais':
        return [
          ['Código', item.codigo || ''],
          ['Nome', item.nome || ''],
          ['Tipo', item.tipo || ''],
          ['Estado', item.estado || ''],
          ['Data Receção', item.data_rececao ? new Date(item.data_rececao).toLocaleDateString('pt-PT') : ''],
          ['Quantidade', item.quantidade?.toString() || ''],
          ['Unidade', item.unidade || '']
        ];
      default:
        return Object.entries(item).slice(0, 10).map(([key, value]) => [
          key.charAt(0).toUpperCase() + key.slice(1),
          value?.toString() || ''
        ]);
    }
  }

  private getModuloTitle(modulo: string): string {
    const titles: Record<string, string> = {
      'geral': 'Geral',
      'ensaios': 'Ensaios',
      'checklists': 'Checklists',
      'materiais': 'Materiais',
      'ncs': 'Não Conformidades',
      'documentos': 'Documentos',
      'fornecedores': 'Fornecedores',
      'obras': 'Obras'
    };
    return titles[modulo] || modulo;
  }

  private getTipoTitle(tipo: string): string {
    const titles: Record<string, string> = {
      'executivo': 'Relatório Executivo',
      'detalhado': 'Relatório Detalhado',
      'comparativo': 'Relatório Comparativo',
      'individual': 'Relatório Individual'
    };
    return titles[tipo] || tipo;
  }
}

// Instância singleton
export const printService = new PrintService(); 
