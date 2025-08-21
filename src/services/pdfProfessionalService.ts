import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Norma } from '../types/normas';

// Configuração profissional para PDFs
interface PDFConfig {
  empresa: {
    nome: string;
    logotipo?: string;
    morada: string;
    telefone: string;
    email: string;
    website?: string;
    nif?: string;
  };
  design: {
    corPrimaria: string;
    corSecundaria: string;
    corTexto: string;
    corFundo: string;
    fonteTitulo: string;
    fonteTexto: string;
  };
}

// Configuração padrão premium
const DEFAULT_PDF_CONFIG: PDFConfig = {
  empresa: {
    nome: 'QUALICORE',
    morada: 'Rua da Qualidade, 123',
    telefone: '+351 123 456 789',
    email: 'info@qualicore.pt',
    website: 'www.qualicore.pt',
    nif: '123456789'
  },
  design: {
    corPrimaria: '#1E40AF', // Azul profissional
    corSecundaria: '#3B82F6',
    corTexto: '#1F2937',
    corFundo: '#F8FAFC',
    fonteTitulo: 'helvetica',
    fonteTexto: 'helvetica'
  }
};

export class PDFProfessionalService {
  private doc: jsPDF;
  private config: PDFConfig;
  private currentY: number = 0;

  constructor(config?: Partial<PDFConfig>) {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.config = { ...DEFAULT_PDF_CONFIG, ...config };
    this.currentY = 0;
  }

  // Gerar PDF profissional para normas
  async gerarPDFNormas(normas: Norma[], titulo: string = 'Relatório de Normas'): Promise<{ tamanho: number; url: string }> {
    try {
      // Adicionar cabeçalho profissional
      this.adicionarCabecalhoProfissional(titulo);
      
      // Adicionar resumo executivo
      this.adicionarResumoExecutivo(normas);
      
      // Adicionar tabela principal de normas
      this.adicionarTabelaNormas(normas);
      
      // Adicionar estatísticas
      this.adicionarEstatisticas(normas);
      
      // Adicionar rodapé profissional
      this.adicionarRodapeProfissional();
      
      // Gerar PDF
      const pdfBlob = this.doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const tamanho = pdfBlob.size;
      
      return { tamanho, url };
    } catch (error) {
      console.error('Erro ao gerar PDF profissional:', error);
      throw new Error('Erro na geração do PDF profissional');
    }
  }

  // Adicionar cabeçalho profissional
  private adicionarCabecalhoProfissional(titulo: string): void {
    const { empresa, design } = this.config;
    
    // Fundo do cabeçalho
    this.doc.setFillColor(30, 41, 59); // Slate-800
    this.doc.rect(0, 0, 210, 45, 'F');
    
    // Linha decorativa
    this.doc.setFillColor(59, 130, 246); // Blue-500
    this.doc.rect(0, 0, 210, 3, 'F');
    
    // Logo/Nome da empresa
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(empresa.nome, 20, 20);
    
    // Informações da empresa
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(empresa.morada, 20, 28);
    this.doc.text(`Tel: ${empresa.telefone} | Email: ${empresa.email}`, 20, 32);
    
    // Título do relatório
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(titulo, 105, 25, { align: 'center' });
    
    // Data de geração
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 105, 35, { align: 'center' });
    
    this.currentY = 55;
  }

  // Adicionar resumo executivo
  private adicionarResumoExecutivo(normas: Norma[]): void {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 41, 59);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo Executivo', 20, this.currentY);
    this.currentY += 8;
    
    // Métricas principais
    const totalNormas = normas.length;
    const normasAtivas = normas.filter(n => n.status === 'ATIVA').length;
    const normasCriticas = normas.filter(n => n.prioridade === 'CRITICA').length;
    const organismosUnicos = new Set(normas.map(n => n.organismo)).size;
    
    // Criar tabela de métricas
    const metricasData = [
      ['Total de Normas', totalNormas.toString()],
      ['Normas Ativas', normasAtivas.toString()],
      ['Normas Críticas', normasCriticas.toString()],
      ['Organismos Normativos', organismosUnicos.toString()]
    ];
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Métrica', 'Valor']],
      body: metricasData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 6,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
  }

  // Adicionar tabela principal de normas
  private adicionarTabelaNormas(normas: Norma[]): void {
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 41, 59);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Lista de Normas', 20, this.currentY);
    this.currentY += 8;
    
    // Preparar dados da tabela
    const tableData = normas.map(norma => [
      norma.codigo,
      norma.titulo,
      this.getCategoriaDisplay(norma.categoria),
      this.getOrganismoDisplay(norma.organismo),
      norma.status,
      norma.prioridade,
      new Date(norma.data_publicacao).toLocaleDateString('pt-PT'),
      norma.versao
    ]);
    
    // Gerar tabela profissional
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Código', 'Título', 'Categoria', 'Organismo', 'Status', 'Prioridade', 'Data Pub.', 'Versão']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 4,
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' }, // Código
        1: { cellWidth: 50 }, // Título
        2: { cellWidth: 25 }, // Categoria
        3: { cellWidth: 25 }, // Organismo
        4: { cellWidth: 20, halign: 'center' }, // Status
        5: { cellWidth: 20, halign: 'center' }, // Prioridade
        6: { cellWidth: 20, halign: 'center' }, // Data
        7: { cellWidth: 15, halign: 'center' } // Versão
      },
      margin: { left: 20, right: 20 },
      didParseCell: (data: any) => {
        // Colorir células baseado no status e prioridade
        if (data.row.index === 0) return; // Pular cabeçalho
        
        const status = data.cell.text[0];
        const prioridade = data.cell.text[1];
        
        if (data.column.index === 4) { // Coluna Status
          if (status === 'ATIVA') {
            data.cell.styles.fillColor = [34, 197, 94]; // Verde
            data.cell.styles.textColor = [255, 255, 255];
          } else if (status === 'REVISAO') {
            data.cell.styles.fillColor = [251, 191, 36]; // Amarelo
            data.cell.styles.textColor = [30, 41, 59];
          } else if (status === 'OBSOLETA') {
            data.cell.styles.fillColor = [239, 68, 68]; // Vermelho
            data.cell.styles.textColor = [255, 255, 255];
          }
        }
        
        if (data.column.index === 5) { // Coluna Prioridade
          if (prioridade === 'CRITICA') {
            data.cell.styles.fillColor = [239, 68, 68]; // Vermelho
            data.cell.styles.textColor = [255, 255, 255];
          } else if (prioridade === 'ALTA') {
            data.cell.styles.fillColor = [251, 146, 60]; // Laranja
            data.cell.styles.textColor = [255, 255, 255];
          } else if (prioridade === 'MEDIA') {
            data.cell.styles.fillColor = [251, 191, 36]; // Amarelo
            data.cell.styles.textColor = [30, 41, 59];
          } else if (prioridade === 'BAIXA') {
            data.cell.styles.fillColor = [59, 130, 246]; // Azul
            data.cell.styles.textColor = [255, 255, 255];
          }
        }
      }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
  }

  // Adicionar estatísticas
  private adicionarEstatisticas(normas: Norma[]): void {
    // Verificar se há espaço suficiente
    if (this.currentY > 250) {
      this.doc.addPage();
      this.currentY = 20;
    }
    
    // Título da seção
    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 41, 59);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Estatísticas Detalhadas', 20, this.currentY);
    this.currentY += 8;
    
    // Estatísticas por categoria
    const categorias = this.getEstatisticasPorCategoria(normas);
    const categoriasData = Object.entries(categorias).map(([cat, count]) => [cat, count.toString()]);
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Categoria', 'Quantidade']],
      body: categoriasData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 6,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
    
    // Estatísticas por organismo
    const organismos = this.getEstatisticasPorOrganismo(normas);
    const organismosData = Object.entries(organismos).map(([org, count]) => [org, count.toString()]);
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Organismo Normativo', 'Quantidade']],
      body: organismosData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 6,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
  }

  // Adicionar rodapé profissional
  private adicionarRodapeProfissional(): void {
    const { empresa } = this.config;
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Fundo do rodapé
      this.doc.setFillColor(30, 41, 59);
      this.doc.rect(0, 280, 210, 20, 'F');
      
      // Linha decorativa
      this.doc.setFillColor(59, 130, 246);
      this.doc.rect(0, 280, 210, 2, 'F');
      
      // Texto do rodapé
      this.doc.setFontSize(8);
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFont('helvetica', 'normal');
      
      const currentTime = new Date().toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      this.doc.text(`${empresa.nome} | Tel: ${empresa.telefone} | Email: ${empresa.email}`, 20, 290);
      this.doc.text(`Página ${i} de ${pageCount} | Gerado em ${currentTime}`, 20, 295);
      this.doc.text(`Endereço: ${empresa.morada}`, 20, 300);
    }
  }

  // Métodos auxiliares
  private getCategoriaDisplay(categoria: string): string {
    const categorias: Record<string, string> = {
      'Estruturas': 'Estruturas',
      'Materiais': 'Materiais',
      'Geotecnia': 'Geotecnia',
      'Seguranca': 'Segurança',
      'Qualidade': 'Qualidade',
      'Ambiente': 'Ambiente',
      'Ferroviario': 'Ferroviário',
      'Rodoviario': 'Rodoviário'
    };
    return categorias[categoria] || categoria;
  }

  private getOrganismoDisplay(organismo: string): string {
    const organismos: Record<string, string> = {
      'IPQ': 'IPQ',
      'CEN': 'CEN',
      'ISO': 'ISO',
      'EN': 'EN',
      'NP': 'NP'
    };
    return organismos[organismo] || organismo;
  }

  private getEstatisticasPorCategoria(normas: Norma[]): Record<string, number> {
    const categorias: Record<string, number> = {};
    normas.forEach(norma => {
      const cat = this.getCategoriaDisplay(norma.categoria);
      categorias[cat] = (categorias[cat] || 0) + 1;
    });
    return categorias;
  }

  private getEstatisticasPorOrganismo(normas: Norma[]): Record<string, number> {
    const organismos: Record<string, number> = {};
    normas.forEach(norma => {
      const org = this.getOrganismoDisplay(norma.organismo);
      organismos[org] = (organismos[org] || 0) + 1;
    });
    return organismos;
  }

  // Gerar PDF de relatório executivo
  async gerarRelatorioExecutivo(normas: Norma[]): Promise<{ tamanho: number; url: string }> {
    try {
      // Adicionar cabeçalho profissional
      this.adicionarCabecalhoProfissional('Relatório Executivo - Normas');
      
      // Adicionar KPIs principais
      this.adicionarKPIsPrincipais(normas);
      
      // Adicionar gráfico de distribuição
      this.adicionarGraficoDistribuicao(normas);
      
      // Adicionar alertas críticos
      this.adicionarAlertasCriticos(normas);
      
      // Adicionar rodapé profissional
      this.adicionarRodapeProfissional();
      
      // Gerar PDF
      const pdfBlob = this.doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const tamanho = pdfBlob.size;
      
      return { tamanho, url };
    } catch (error) {
      console.error('Erro ao gerar relatório executivo:', error);
      throw new Error('Erro na geração do relatório executivo');
    }
  }

  // Adicionar KPIs principais
  private adicionarKPIsPrincipais(normas: Norma[]): void {
    // Título da seção
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 41, 59);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('KPIs Principais', 20, this.currentY);
    this.currentY += 10;
    
    // Calcular KPIs
    const totalNormas = normas.length;
    const normasAtivas = normas.filter(n => n.status === 'ATIVA').length;
    const normasCriticas = normas.filter(n => n.prioridade === 'CRITICA').length;
    const taxaConformidade = totalNormas > 0 ? Math.round((normasAtivas / totalNormas) * 100) : 0;
    
    // Criar tabela de KPIs
    const kpisData = [
      ['Total de Normas', totalNormas.toString(), ''],
      ['Normas Ativas', normasAtivas.toString(), `${taxaConformidade}%`],
      ['Normas Críticas', normasCriticas.toString(), ''],
      ['Taxa de Conformidade', `${taxaConformidade}%`, '']
    ];
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['KPI', 'Valor', 'Percentagem']],
      body: kpisData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 11,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 8,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { halign: 'center', cellWidth: 40 },
        2: { halign: 'center', cellWidth: 40 }
      },
      margin: { left: 20, right: 20 }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 20;
  }

  // Adicionar gráfico de distribuição
  private adicionarGraficoDistribuicao(normas: Norma[]): void {
    // Título da seção
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 41, 59);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Distribuição por Categoria', 20, this.currentY);
    this.currentY += 10;
    
    // Calcular distribuição
    const categorias = this.getEstatisticasPorCategoria(normas);
    const categoriasData = Object.entries(categorias).map(([cat, count]) => [cat, count.toString()]);
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Categoria', 'Quantidade']],
      body: categoriasData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 11,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 8,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 20;
  }

  // Adicionar alertas críticos
  private adicionarAlertasCriticos(normas: Norma[]): void {
    // Título da seção
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 41, 59);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Alertas Críticos', 20, this.currentY);
    this.currentY += 10;
    
    // Identificar alertas
    const normasCriticas = normas.filter(n => n.prioridade === 'CRITICA');
    const normasVencendo = normas.filter(n => {
      const dataVencimento = new Date(n.data_entrada_vigor);
      const hoje = new Date();
      const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diasAteVencimento <= 30 && diasAteVencimento > 0;
    });
    
    const alertasData = [
      ['Normas Críticas', normasCriticas.length.toString(), 'Requer atenção imediata'],
      ['Normas Vencendo (30d)', normasVencendo.length.toString(), 'Renovação necessária']
    ];
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Tipo de Alerta', 'Quantidade', 'Ação Necessária']],
      body: alertasData,
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68], // Vermelho para alertas
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 11,
        textColor: [30, 41, 59]
      },
      styles: {
        cellPadding: 8,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { fontStyle: 'italic' }
      },
      margin: { left: 20, right: 20 }
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 20;
  }
}

// Instância singleton
export const pdfProfessionalService = new PDFProfessionalService();
