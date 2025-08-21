import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Material, Fornecedor, Obra } from '@/types';
import { Armadura } from '@/types/armaduras';
import PDFConfigService from './pdfConfigService';

// Configuração premium para PDFs - INSPIRADA NO PROCORE/SOFTEXPERT
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
  obra?: {
    id?: string;
    nome: string;
    localizacao: string;
    referencia: string;
    cliente: string;
    responsavel_tecnico?: string;
    coordenador_obra?: string;
    fiscal_obra?: string;
    engenheiro_responsavel?: string;
    arquiteto?: string;
    valor_contrato?: number;
    percentual_execucao?: number;
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
  obra: {
    nome: 'Obra Principal',
    localizacao: 'Lisboa, Portugal',
    referencia: 'OBRA-2024-001',
    cliente: 'Cliente Principal'
  },
  design: {
    corPrimaria: '#1E40AF', // Azul mais profissional
    corSecundaria: '#3B82F6',
    corTexto: '#1F2937',
    corFundo: '#F8FAFC',
    fonteTitulo: 'helvetica',
    fonteTexto: 'helvetica'
  }
};

export class PDFService {
  private doc: jsPDF;
  private config: PDFConfig;
  private logoImage: HTMLImageElement | null = null;

  constructor(config?: Partial<PDFConfig>) {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.config = { ...DEFAULT_PDF_CONFIG, ...config };
    this.loadLogo();
  }

  // Carregar logotipo de forma robusta
  private async loadLogo(): Promise<void> {
    if (!this.config.empresa.logotipo) return;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.logoImage = img;
        console.log('✅ Logotipo carregado com sucesso');
        resolve();
      };
      
      img.onerror = () => {
        console.warn('❌ Erro ao carregar logotipo, usando fallback');
        this.logoImage = null;
        resolve();
      };

      // Suportar tanto data URLs quanto URLs normais
      img.src = this.config.empresa.logotipo;
    });
  }

  // Cabeçalho premium estilo Procore/SoftExpert
  private addPremiumHeader(titulo: string, subtitulo?: string) {
    const { empresa, obra, design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Fundo principal com gradiente sutil
    this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    this.doc.rect(0, 0, 210, 85, 'F');
    
    // Linha decorativa superior (estilo Procore)
    this.doc.setFillColor(255, 255, 255, 0.2);
    this.doc.rect(0, 0, 210, 2, 'F');
    
    // Elementos decorativos geométricos (estilo moderno)
    this.doc.setFillColor(255, 255, 255, 0.1);
    this.doc.circle(25, 25, 6, 'F');
    this.doc.circle(185, 20, 4, 'F');
    this.doc.circle(195, 65, 3, 'F');
    
    // Logotipo com tratamento profissional
    if (this.logoImage && this.config.empresa.logotipo) {
      try {
        const logoWidth = 40;
        const logoHeight = 40;
        const logoY = 20;
        const logoX = 20;
        
        // Fundo circular para o logotipo
        this.doc.setFillColor(255, 255, 255, 0.15);
        this.doc.circle(logoX + logoWidth/2, logoY + logoHeight/2, logoWidth/2 + 8, 'F');
        
        // Adicionar imagem usando canvas para melhor qualidade
        const canvas = document.createElement('canvas');
        canvas.width = logoWidth * 2;
        canvas.height = logoHeight * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(this.logoImage, 0, 0, canvas.width, canvas.height);
          const logoDataUrl = canvas.toDataURL('image/png');
          this.doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
          console.log('✅ Logotipo adicionado com sucesso via canvas');
        }
      } catch (error) {
        console.log('❌ Erro ao adicionar logotipo:', error);
        this.addCompanyTextFallback(empresa.nome, 30, 45);
      }
    } else {
      this.addCompanyTextFallback(empresa.nome, 30, 45);
    }
    
    // Informações da empresa (lado direito - estilo Procore)
    this.doc.setFontSize(9);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(empresa.morada, 170, 30);
    this.doc.text(empresa.telefone, 170, 35);
    this.doc.text(empresa.email, 170, 40);
    if (empresa.website) {
      this.doc.text(empresa.website, 170, 45);
    }
    
    // Título principal (centro - estilo Procore)
    this.doc.setFontSize(26);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(titulo, 105, 60, { align: 'center' });
    
    // Subtítulo
    if (subtitulo) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(subtitulo, 105, 70, { align: 'center' });
    }
    
    // Informações da obra (sem emojis)
    if (obra) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Obra: ${obra.nome}`, 105, 78, { align: 'center' });
      this.doc.text(`${obra.localizacao} | Cliente: ${obra.cliente}`, 105, 83, { align: 'center' });
    }
  }

  // Método para adicionar texto da empresa como fallback
  private addCompanyTextFallback(nome: string, x: number, y: number) {
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(nome, x, y);
  }

  // Rodapé premium estilo Procore/SoftExpert
  private addPremiumFooter() {
    const { empresa, design } = this.config;
    const pageCount = (this.doc as any).getNumberOfPages();
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Fundo do rodapé
      this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.rect(0, 280, 210, 20, 'F');
      
      // Linha decorativa superior
      this.doc.setFillColor(255, 255, 255, 0.2);
      this.doc.rect(0, 280, 210, 2, 'F');
      
      // Elementos decorativos
      this.doc.setFillColor(255, 255, 255, 0.1);
      this.doc.circle(25, 290, 3, 'F');
      this.doc.circle(185, 290, 3, 'F');
      
      // Texto do rodapé sem emojis
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
      this.doc.text(`Pagina ${i} de ${pageCount} | Gerado em ${currentTime}`, 20, 295);
      this.doc.text(`Endereco: ${empresa.morada}`, 20, 300);
    }
  }

  // Tabela premium estilo Procore/SoftExpert - CORRIGIDA
  private addPremiumTable(headers: string[], data: any[][], startY: number, title?: string) {
    const { design } = this.config;
    
    if (title) {
      this.doc.setFontSize(16);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, 20, startY);
      startY += 15;
    }
    
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Configuração de tabela estilo Procore - CORRIGIDA
    autoTable(this.doc, {
      startY: startY,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        cellPadding: 6
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
        textColor: [31, 41, 55]
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        cellWidth: 'auto',
        lineColor: [229, 231, 235],
        lineWidth: 0.3
      },
      // Configuração dinâmica de colunas baseada no número de headers
      columnStyles: this.generateColumnStyles(headers.length),
      margin: { left: 10, right: 10, top: 5 },
      tableWidth: 190,
      pageBreak: 'auto'
    });
    
    return (this.doc as any).lastAutoTable.finalY + 20;
  }

  // Gerar configuração dinâmica de colunas
  private generateColumnStyles(columnCount: number) {
    const styles: any = {};
    const baseWidth = 190 / columnCount;
    
    for (let i = 0; i < columnCount; i++) {
      styles[i] = { 
        cellWidth: baseWidth - 2, 
        halign: 'center',
        overflow: 'linebreak'
      };
    }
    
    return styles;
  }

  // Função auxiliar para converter hex para RGB
  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [59, 130, 246];
  }

  // Gráfico de barras profissional estilo Procore
  private addProfessionalBarChart(data: { label: string; value: number }[], startY: number, title: string) {
    const { design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Título do gráfico
    this.doc.setFontSize(14);
    this.doc.setTextColor(design.corTexto);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, startY);
    startY += 10;
    
    const chartWidth = 170;
    const chartHeight = 80;
    const barWidth = chartWidth / data.length;
    const maxValue = Math.max(...data.map(d => d.value));
    
    // Fundo do gráfico com gradiente
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(20, startY, chartWidth, chartHeight, 'F');
    
    // Bordas arredondadas simuladas
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, startY, chartWidth, chartHeight);
    
    // Barras com efeito 3D
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (chartHeight - 30);
      const x = 25 + (index * barWidth);
      const y = startY + chartHeight - barHeight - 15;
      
      // Sombra da barra
      this.doc.setFillColor(200, 200, 200);
      this.doc.rect(x + 1, y + 1, barWidth - 2, barHeight, 'F');
      
      // Barra principal
      this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.rect(x, y, barWidth - 2, barHeight, 'F');
      
      // Highlight da barra
      this.doc.setFillColor(255, 255, 255, 0.3);
      this.doc.rect(x, y, barWidth - 2, barHeight * 0.3, 'F');
      
      // Valor no topo da barra
      this.doc.setFontSize(8);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.value.toString(), x + (barWidth - 2) / 2, y - 5, { align: 'center' });
      
      // Label da barra
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.label, x + (barWidth - 2) / 2, startY + chartHeight - 5, { align: 'center' });
    });
    
    return startY + chartHeight + 20;
  }

  // Seção de estatísticas estilo Procore
  private addStatisticsSection(stats: any, startY: number) {
    const { design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Título da seção
    this.doc.setFontSize(16);
    this.doc.setTextColor(design.corTexto);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Estatisticas Principais', 20, startY);
    startY += 15;
    
    // Cards de estatísticas em grid 2x2
    const cardWidth = 85;
    const cardHeight = 40;
    const cards = [
      { label: 'Mes Atual', value: stats.mesAtual || 0 },
      { label: 'Mes Anterior', value: stats.mesAnterior || 0 },
      { label: 'Variacao', value: stats.variacao || 0, prefix: '+' },
      { label: 'Total Geral', value: stats.totalGeral || 0 }
    ];
    
    cards.forEach((card, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = 20 + (col * (cardWidth + 10));
      const y = startY + (row * (cardHeight + 10));
      
      // Fundo do card
      this.doc.setFillColor(248, 250, 252);
      this.doc.rect(x, y, cardWidth, cardHeight, 'F');
      
      // Borda do card
      this.doc.setDrawColor(229, 231, 235);
      this.doc.setLineWidth(0.5);
      this.doc.rect(x, y, cardWidth, cardHeight);
      
      // Valor
      this.doc.setFontSize(18);
      this.doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.setFont('helvetica', 'bold');
      const valueText = `${card.prefix || ''}${card.value}`;
      this.doc.text(valueText, x + cardWidth / 2, y + 15, { align: 'center' });
      
      // Label
      this.doc.setFontSize(8);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(card.label, x + cardWidth / 2, y + 30, { align: 'center' });
    });
    
    return startY + 100;
  }

  // Métodos públicos para configuração
  public updateConfig(newConfig: Partial<PDFConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.empresa?.logotipo) {
      this.loadLogo();
    }
  }

  public setLogotipo(logotipoUrl: string) {
    this.config.empresa.logotipo = logotipoUrl;
    this.loadLogo();
  }

  public setEmpresa(empresa: Partial<PDFConfig['empresa']>) {
    this.config.empresa = { ...this.config.empresa, ...empresa };
  }

  public setObra(obra: PDFConfig['obra']) {
    this.config.obra = obra;
  }

  // Método para salvar PDF
  public save(filename?: string) {
    const defaultFilename = `relatorio_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(filename || defaultFilename);
  }

  // Métodos de geração de relatórios para Armaduras
  public async generateArmadurasExecutiveReport(armaduras: Armadura[]) {
    try {
      this.addPremiumHeader('Relatorio Executivo', 'Armaduras - Visao Geral');
      
      const stats = {
        mesAtual: armaduras.filter(a => new Date(a.data_rececao).getMonth() === new Date().getMonth()).length,
        mesAnterior: armaduras.filter(a => new Date(a.data_rececao).getMonth() === new Date().getMonth() - 1).length,
        variacao: 0,
        totalGeral: armaduras.length
      };
      stats.variacao = stats.mesAtual - stats.mesAnterior;
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Gráfico de distribuição por tipo
      const tipoStats = armaduras.reduce((acc, armadura) => {
        acc[armadura.tipo] = (acc[armadura.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const chartData = Object.entries(tipoStats).map(([tipo, count]) => ({
        label: tipo,
        value: count as number
      }));
      
      currentY = this.addProfessionalBarChart(chartData, currentY, 'Distribuicao por Tipo');
      
      // Tabela principal
      const tableData = armaduras.slice(0, 10).map(armadura => [
        armadura.codigo,
        armadura.tipo,
        armadura.diametro,
        armadura.quantidade.toString(),
        `${armadura.peso_total}kg`,
        armadura.estado,
        new Date(armadura.data_rececao).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Tipo', 'Diametro', 'Quantidade', 'Peso', 'Estado', 'Data'],
        tableData,
        currentY,
        'Armaduras Principais'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório executivo:', error);
    }
  }

  public async generateArmadurasComparativeReport(armaduras: Armadura[]) {
    try {
      this.addPremiumHeader('Relatorio Comparativo', 'Armaduras - Analise Temporal');
      
      const stats = {
        mesAtual: armaduras.filter(a => new Date(a.data_rececao).getMonth() === new Date().getMonth()).length,
        mesAnterior: armaduras.filter(a => new Date(a.data_rececao).getMonth() === new Date().getMonth() - 1).length,
        variacao: 0,
        totalGeral: armaduras.length
      };
      stats.variacao = stats.mesAtual - stats.mesAnterior;
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela comparativa
      const tableData = armaduras.map(armadura => [
        armadura.codigo,
        armadura.tipo,
        armadura.diametro,
        armadura.quantidade.toString(),
        `${armadura.peso_total}kg`,
        armadura.estado,
        new Date(armadura.data_rececao).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Tipo', 'Diametro', 'Quantidade', 'Peso', 'Estado', 'Data'],
        tableData,
        currentY,
        'Comparativo Detalhado de Armaduras'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo:', error);
    }
  }

  public async generateArmadurasFilteredReport(armaduras: Armadura[], filtros: any) {
    try {
      this.addPremiumHeader('Relatorio Filtrado', 'Armaduras - Dados Especificos');
      
      const stats = {
        mesAtual: armaduras.length,
        mesAnterior: 0,
        variacao: armaduras.length,
        totalGeral: armaduras.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela filtrada
      const tableData = armaduras.map(armadura => [
        armadura.codigo,
        armadura.tipo,
        armadura.diametro,
        armadura.quantidade.toString(),
        `${armadura.peso_total}kg`,
        armadura.estado,
        new Date(armadura.data_rececao).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Tipo', 'Diametro', 'Quantidade', 'Peso', 'Estado', 'Data'],
        tableData,
        currentY,
        'Armaduras Filtradas'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório filtrado:', error);
    }
  }

  public async generateArmadurasIndividualReport(armaduras: Armadura[]) {
    try {
      this.addPremiumHeader('Relatorio Individual', 'Armaduras - Detalhes Especificos');
      
      armaduras.forEach((armadura, index) => {
        if (index > 0) {
          this.doc.addPage();
          this.addPremiumHeader('Relatorio Individual', 'Armaduras - Detalhes Especificos');
        }
        
        let currentY = 100;
        
        // Informações detalhadas
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.config.design.corTexto);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`Armadura: ${armadura.codigo}`, 20, currentY);
        currentY += 20;
        
        const details = [
          ['Codigo', armadura.codigo],
          ['Tipo', armadura.tipo],
          ['Diametro', armadura.diametro],
          ['Quantidade', armadura.quantidade.toString()],
          ['Peso Total', `${armadura.peso_total}kg`],
          ['Estado', armadura.estado],
          ['Data Rececao', new Date(armadura.data_rececao).toLocaleDateString('pt-PT')]
        ];
        
        this.addPremiumTable(['Campo', 'Valor'], details, currentY, 'Detalhes da Armadura');
        
        this.addPremiumFooter();
      });
      
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório individual:', error);
    }
  }

  // Métodos para outros módulos (Solos, Fornecedores, etc.)
  public async generateSolosExecutiveReport(solos: any[]) {
    try {
      this.addPremiumHeader('Relatorio Executivo', 'Solos - Visao Geral');
      
      const stats = {
        mesAtual: solos.length,
        mesAnterior: 0,
        variacao: solos.length,
        totalGeral: solos.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela básica
      const tableData = solos.slice(0, 10).map(solo => [
        solo.codigo || 'N/A',
        solo.tipo || 'N/A',
        solo.estado || 'N/A',
        new Date().toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Tipo', 'Estado', 'Data'],
        tableData,
        currentY,
        'Solos Principais'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório de solos:', error);
    }
  }

  public async generateFornecedoresExecutiveReport(fornecedores: Fornecedor[]) {
    try {
      this.addPremiumHeader('Relatorio Executivo', 'Fornecedores - Visao Geral');
      
      const stats = {
        mesAtual: fornecedores.length,
        mesAnterior: 0,
        variacao: fornecedores.length,
        totalGeral: fornecedores.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela de fornecedores
      const tableData = fornecedores.map(fornecedor => [
        fornecedor.nome,
        fornecedor.nif || 'N/A',
        fornecedor.morada || 'N/A',
        fornecedor.estado || 'N/A',
        fornecedor.telefone || 'N/A'
      ]);
      
      this.addPremiumTable(
        ['Nome', 'NIF', 'Morada', 'Estado', 'Telefone'],
        tableData,
        currentY,
        'Lista de Fornecedores'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório de fornecedores:', error);
    }
  }

  public async generateNaoConformidadesExecutiveReport(naoConformidades: any[]) {
    try {
      this.addPremiumHeader('Relatorio Executivo', 'Nao Conformidades - Visao Geral');
      
      const stats = {
        mesAtual: naoConformidades.length,
        mesAnterior: 0,
        variacao: naoConformidades.length,
        totalGeral: naoConformidades.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela básica
      const tableData = naoConformidades.map(nc => [
        nc.codigo || 'N/A',
        nc.descricao || 'N/A',
        nc.estado || 'N/A',
        new Date().toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Descricao', 'Estado', 'Data'],
        tableData,
        currentY,
        'Nao Conformidades'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório de não conformidades:', error);
    }
  }

  // Métodos para Obras
  public async generateObrasExecutiveReport(obras: any[]) {
    try {
      this.addPremiumHeader('Relatorio Executivo', 'Obras - Visao Geral');
      
      const stats = {
        mesAtual: obras.length,
        mesAnterior: 0,
        variacao: obras.length,
        totalGeral: obras.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela de obras
      const tableData = obras.map(obra => [
        obra.codigo || 'N/A',
        obra.nome || 'N/A',
        obra.cliente || 'N/A',
        obra.localizacao || 'N/A',
        obra.status || 'N/A',
        `${obra.percentual_execucao || 0}%`,
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato || 0)
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Nome', 'Cliente', 'Localizacao', 'Status', 'Progresso', 'Valor'],
        tableData,
        currentY,
        'Lista de Obras'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório de obras:', error);
    }
  }

  public async generateObrasComparativeReport(obras: any[]) {
    try {
      this.addPremiumHeader('Relatorio Comparativo', 'Obras - Analise Comparativa');
      
      const stats = {
        mesAtual: obras.length,
        mesAnterior: 0,
        variacao: obras.length,
        totalGeral: obras.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela comparativa
      const tableData = obras.map(obra => [
        obra.codigo || 'N/A',
        obra.nome || 'N/A',
        obra.tipo_obra || 'N/A',
        obra.categoria || 'N/A',
        obra.status || 'N/A',
        `${obra.percentual_execucao || 0}%`,
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato || 0)
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Nome', 'Tipo', 'Categoria', 'Status', 'Progresso', 'Valor'],
        tableData,
        currentY,
        'Comparativo de Obras'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo de obras:', error);
    }
  }

  public async generateObrasFilteredReport(obras: any[], filtros: any) {
    try {
      this.addPremiumHeader('Relatorio Filtrado', 'Obras - Dados Especificos');
      
      const stats = {
        mesAtual: obras.length,
        mesAnterior: 0,
        variacao: obras.length,
        totalGeral: obras.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela filtrada
      const tableData = obras.map(obra => [
        obra.codigo || 'N/A',
        obra.nome || 'N/A',
        obra.cliente || 'N/A',
        obra.responsavel_tecnico || 'N/A',
        obra.status || 'N/A',
        `${obra.percentual_execucao || 0}%`,
        new Date(obra.data_inicio || new Date()).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Nome', 'Cliente', 'Responsavel', 'Status', 'Progresso', 'Data Inicio'],
        tableData,
        currentY,
        'Obras Filtradas'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório filtrado de obras:', error);
    }
  }

  public async generateObrasIndividualReport(obras: any[]) {
    try {
      this.addPremiumHeader('Relatorio Individual', 'Obras - Detalhes Especificos');
      
      obras.forEach((obra, index) => {
        if (index > 0) {
          this.doc.addPage();
          this.addPremiumHeader('Relatorio Individual', 'Obras - Detalhes Especificos');
        }
        
        let currentY = 100;
        
        // Informações detalhadas
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.config.design.corTexto);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`Obra: ${obra.nome}`, 20, currentY);
        currentY += 20;
        
        const details = [
          ['Codigo', obra.codigo || 'N/A'],
          ['Nome', obra.nome || 'N/A'],
          ['Cliente', obra.cliente || 'N/A'],
          ['Localizacao', obra.localizacao || 'N/A'],
          ['Tipo', obra.tipo_obra || 'N/A'],
          ['Categoria', obra.categoria || 'N/A'],
          ['Status', obra.status || 'N/A'],
          ['Progresso', `${obra.percentual_execucao || 0}%`],
          ['Valor Contrato', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato || 0)],
          ['Responsavel Tecnico', obra.responsavel_tecnico || 'N/A'],
          ['Coordenador', obra.coordenador_obra || 'N/A'],
          ['Fiscal', obra.fiscal_obra || 'N/A'],
          ['Engenheiro', obra.engenheiro_responsavel || 'N/A'],
          ['Arquiteto', obra.arquiteto || 'N/A'],
          ['Data Inicio', new Date(obra.data_inicio || new Date()).toLocaleDateString('pt-PT')],
          ['Data Fim Prevista', new Date(obra.data_fim_prevista || new Date()).toLocaleDateString('pt-PT')]
        ];
        
        this.addPremiumTable(['Campo', 'Valor'], details, currentY, 'Detalhes da Obra');
        
        this.addPremiumFooter();
      });
      
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório individual de obras:', error);
    }
  }

  public async generateDocumentosIndividualReport(documentos: any[]) {
    try {
      this.addPremiumHeader('Relatorio Individual', 'Documentos - Detalhes Especificos');
      
      documentos.forEach((documento, index) => {
        if (index > 0) {
          this.doc.addPage();
          this.addPremiumHeader('Relatorio Individual', 'Documentos - Detalhes Especificos');
        }
        
        let currentY = 100;
        
        // Informações detalhadas
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.config.design.corTexto);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`Documento: ${documento.codigo}`, 20, currentY);
        currentY += 20;
        
        const details = [
          ['Codigo', documento.codigo || 'N/A'],
          ['Tipo', documento.tipo || 'N/A'],
          ['Versao', documento.versao || 'N/A'],
          ['Estado', documento.estado || 'N/A'],
          ['Responsavel', documento.responsavel || 'N/A'],
          ['Zona', documento.zona || 'N/A'],
          ['Data Validade', new Date(documento.data_validade || new Date()).toLocaleDateString('pt-PT')],
          ['Data Criacao', new Date(documento.created || documento.data_criacao || new Date()).toLocaleDateString('pt-PT')],
          ['Data Atualizacao', new Date(documento.updated || documento.data_atualizacao || new Date()).toLocaleDateString('pt-PT')],
          ['Observacoes', documento.observacoes || 'N/A']
        ];
        
        this.addPremiumTable(['Campo', 'Valor'], details, currentY, 'Detalhes do Documento');
        
        this.addPremiumFooter();
      });
      
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório individual de documentos:', error);
    }
  }

  public async generateDocumentosExecutiveReport(documentos: any[]) {
    try {
      this.addPremiumHeader('Relatorio Executivo', 'Documentos - Visao Geral');
      
      const stats = {
        mesAtual: documentos.length,
        mesAnterior: 0,
        variacao: documentos.length,
        totalGeral: documentos.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Gráfico de distribuição por tipo
      const tipoStats = documentos.reduce((acc: Record<string, number>, documento) => {
        acc[documento.tipo] = (acc[documento.tipo] || 0) + 1;
        return acc;
      }, {});
      
      const chartData = Object.entries(tipoStats).map(([tipo, count]) => ({
        label: tipo,
        value: count
      }));
      
      currentY = this.addProfessionalBarChart(chartData, currentY, 'Distribuicao por Tipo');
      
      // Tabela principal
      const tableData = documentos.slice(0, 10).map(documento => [
        documento.codigo || 'N/A',
        documento.tipo || 'N/A',
        documento.estado || 'N/A',
        documento.responsavel || 'N/A',
        documento.zona || 'N/A',
        new Date(documento.data_validade || new Date()).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Tipo', 'Estado', 'Responsavel', 'Zona', 'Data Validade'],
        tableData,
        currentY,
        'Documentos Principais'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório executivo de documentos:', error);
    }
  }

  public async generateDocumentosFilteredReport(documentos: any[], filtros: any) {
    try {
      this.addPremiumHeader('Relatorio Filtrado', 'Documentos - Dados Especificos');
      
      const stats = {
        mesAtual: documentos.length,
        mesAnterior: 0,
        variacao: documentos.length,
        totalGeral: documentos.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tabela filtrada
      const tableData = documentos.map(documento => [
        documento.codigo || 'N/A',
        documento.tipo || 'N/A',
        documento.estado || 'N/A',
        documento.responsavel || 'N/A',
        documento.zona || 'N/A',
        new Date(documento.data_validade || new Date()).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Codigo', 'Tipo', 'Estado', 'Responsavel', 'Zona', 'Data Validade'],
        tableData,
        currentY,
        'Documentos Filtrados'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório filtrado de documentos:', error);
    }
  }
}
