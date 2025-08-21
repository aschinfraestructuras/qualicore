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
        value: count as number
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

  // ===== MÉTODOS PARA RFIs =====
  
  public async generateRFIsExecutiveReport(rfis: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório Executivo', 'RFIs - Visão Geral');
      
      const stats = {
        mesAtual: rfis.length,
        mesAnterior: 0,
        variacao: rfis.length,
        totalGeral: rfis.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Estatísticas por status
      const statusStats = rfis.reduce((acc: Record<string, number>, rfi) => {
        acc[rfi.status] = (acc[rfi.status] || 0) + 1;
        return acc;
      }, {});
      
      const statusData = Object.entries(statusStats).map(([status, count]) => ({
        label: status,
        value: count as number
      }));
      
      currentY = this.addProfessionalBarChart(statusData, currentY, 'Distribuição por Status');
      
      // Estatísticas por prioridade
      const prioridadeStats = rfis.reduce((acc: Record<string, number>, rfi) => {
        acc[rfi.prioridade] = (acc[rfi.prioridade] || 0) + 1;
        return acc;
      }, {});
      
      const prioridadeData = Object.entries(prioridadeStats).map(([prioridade, count]) => ({
        label: prioridade,
        value: count as number
      }));
      
      currentY = this.addProfessionalBarChart(prioridadeData, currentY, 'Distribuição por Prioridade');
      
      // Tabela principal
      const tableData = rfis.slice(0, 10).map(rfi => [
        rfi.numero || 'N/A',
        rfi.titulo || 'N/A',
        rfi.solicitante || 'N/A',
        rfi.destinatario || 'N/A',
        rfi.status || 'N/A',
        rfi.prioridade || 'N/A',
        new Date(rfi.data_solicitacao || new Date()).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Número', 'Título', 'Solicitante', 'Destinatário', 'Status', 'Prioridade', 'Data'],
        tableData,
        currentY,
        'RFIs Principais'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório executivo de RFIs:', error);
      throw error;
    }
  }

  public async generateRFIsFilteredReport(rfis: any[], filtros: any): Promise<void> {
    try {
      this.addPremiumHeader('Relatório Filtrado', 'RFIs - Dados Específicos');
      
      const stats = {
        mesAtual: rfis.length,
        mesAnterior: 0,
        variacao: rfis.length,
        totalGeral: rfis.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Informações dos filtros aplicados
      const filtrosInfo = Object.entries(filtros)
        .filter(([_, value]) => value && value !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      if (filtrosInfo) {
        this.doc.setFontSize(12);
        this.doc.setTextColor(75, 85, 99);
        this.doc.text(`Filtros aplicados: ${filtrosInfo}`, 20, currentY);
        currentY += 15;
      }
      
      // Tabela filtrada
      const tableData = rfis.map(rfi => [
        rfi.numero || 'N/A',
        rfi.titulo || 'N/A',
        rfi.solicitante || 'N/A',
        rfi.destinatario || 'N/A',
        rfi.status || 'N/A',
        rfi.prioridade || 'N/A',
        new Date(rfi.data_solicitacao || new Date()).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Número', 'Título', 'Solicitante', 'Destinatário', 'Status', 'Prioridade', 'Data'],
        tableData,
        currentY,
        'RFIs Filtrados'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório filtrado de RFIs:', error);
      throw error;
    }
  }

  public async generateRFIsComparativeReport(rfis: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório Comparativo', 'RFIs - Análise Comparativa');
      
      const stats = {
        mesAtual: rfis.length,
        mesAnterior: 0,
        variacao: rfis.length,
        totalGeral: rfis.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Análise por solicitante
      const solicitanteStats = rfis.reduce((acc: Record<string, number>, rfi) => {
        acc[rfi.solicitante] = (acc[rfi.solicitante] || 0) + 1;
        return acc;
      }, {});
      
      const solicitanteData = Object.entries(solicitanteStats).map(([solicitante, count]) => ({
        label: solicitante,
        value: count as number
      }));
      
      currentY = this.addProfessionalBarChart(solicitanteData, currentY, 'RFIs por Solicitante');
      
      // Análise por destinatário
      const destinatarioStats = rfis.reduce((acc: Record<string, number>, rfi) => {
        acc[rfi.destinatario] = (acc[rfi.destinatario] || 0) + 1;
        return acc;
      }, {});
      
      const destinatarioData = Object.entries(destinatarioStats).map(([destinatario, count]) => ({
        label: destinatario,
        value: count as number
      }));
      
      currentY = this.addProfessionalBarChart(destinatarioData, currentY, 'RFIs por Destinatário');
      
      // Tabela comparativa
      const tableData = rfis.slice(0, 15).map(rfi => [
        rfi.numero || 'N/A',
        rfi.titulo || 'N/A',
        rfi.solicitante || 'N/A',
        rfi.destinatario || 'N/A',
        rfi.status || 'N/A',
        rfi.prioridade || 'N/A',
        new Date(rfi.data_solicitacao || new Date()).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(
        ['Número', 'Título', 'Solicitante', 'Destinatário', 'Status', 'Prioridade', 'Data'],
        tableData,
        currentY,
        'Análise Comparativa'
      );
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo de RFIs:', error);
      throw error;
    }
  }

  // ===== RELATÓRIOS SUBMISSÃO DE MATERIAIS =====
  
  public async generateSubmissaoMateriaisPerformanceReport(submissoes: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório de Performance', 'Submissão de Materiais');
      
      let currentY = 100;
      
      // Estatísticas gerais
      const total = submissoes.length;
      const aprovadas = submissoes.filter(s => s.estado === 'aprovado').length;
      const rejeitadas = submissoes.filter(s => s.estado === 'rejeitado').length;
      const pendentes = submissoes.filter(s => s.estado === 'pendente' || s.estado === 'submetido').length;
      const emRevisao = submissoes.filter(s => s.estado === 'em_revisao' || s.estado === 'aguardando_aprovacao').length;
      const urgentes = submissoes.filter(s => s.urgencia === 'urgente').length;
      const criticas = submissoes.filter(s => s.prioridade === 'critica').length;
      
      const taxaAprovacao = total > 0 ? (aprovadas / total) * 100 : 0;
      
      // Calcular tempo médio de aprovação
      const aprovadasComData = submissoes.filter(s => s.estado === 'aprovado' && s.data_aprovacao && s.data_submissao);
      const tempoMedioAprovacao = aprovadasComData.length > 0 
        ? aprovadasComData.reduce((acc, s) => {
            const dataSubmissao = new Date(s.data_submissao);
            const dataAprovacao = new Date(s.data_aprovacao);
            return acc + (dataAprovacao.getTime() - dataSubmissao.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / aprovadasComData.length
        : 0;
      
      // Impacto total
      const impactoCustoTotal = submissoes.reduce((acc, s) => acc + (s.impacto_custo || 0), 0);
      const impactoPrazoTotal = submissoes.reduce((acc, s) => acc + (s.impacto_prazo || 0), 0);
      
      // Análise por tipo
      const tipoStats = submissoes.reduce((acc, s) => {
        acc[s.tipo_material] = (acc[s.tipo_material] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const chartData = Object.entries(tipoStats).map(([tipo, count]) => ({
        label: tipo,
        value: count as number
      }));
      
      // Adicionar estatísticas
      this.doc.setFontSize(16);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Estatísticas de Performance', 50, currentY);
      currentY += 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      
      const stats = [
        ['Total de Submissões', total.toString()],
        ['Aprovadas', `${aprovadas} (${taxaAprovacao.toFixed(1)}%)`],
        ['Rejeitadas', rejeitadas.toString()],
        ['Pendentes', pendentes.toString()],
        ['Em Revisão', emRevisao.toString()],
        ['Urgentes', urgentes.toString()],
        ['Críticas', criticas.toString()],
        ['Tempo Médio Aprovação', `${tempoMedioAprovacao.toFixed(1)} dias`],
        ['Impacto Total Custo', `${impactoCustoTotal.toLocaleString('pt-PT')}€`],
        ['Impacto Total Prazo', `${impactoPrazoTotal} dias`]
      ];
      
      this.addTable(stats, 50, currentY, 500);
      currentY += stats.length * 20 + 40;
      
      // Gráfico de distribuição por tipo
      if (chartData.length > 0) {
        this.doc.setFontSize(14);
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Distribuição por Tipo de Material', 50, currentY);
        currentY += 30;
        
        this.addPieChart(chartData, 50, currentY, 200);
        currentY += 150;
      }
      
      // KPIs principais
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('KPIs Principais', 50, currentY);
      currentY += 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      
      const kpis = [
        ['Taxa de Aprovação', `${taxaAprovacao.toFixed(1)}%`],
        ['Tempo Médio de Aprovação', `${tempoMedioAprovacao.toFixed(1)} dias`],
        ['Taxa de Urgência', `${((urgentes / total) * 100).toFixed(1)}%`],
        ['Taxa de Críticas', `${((criticas / total) * 100).toFixed(1)}%`]
      ];
      
      this.addTable(kpis, 50, currentY, 300);
      
      this.addFooter();
      this.doc.save('relatorio_performance_submissao_materiais.pdf');
      
    } catch (error) {
      console.error('Erro ao gerar relatório de performance:', error);
      throw error;
    }
  }
  
  public async generateSubmissaoMateriaisTrendsReport(submissoes: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Análise de Tendências', 'Submissão de Materiais');
      
      let currentY = 100;
      
      // Calcular tendências mensais
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const trends = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = new Date().getMonth() - i;
        const monthName = months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
        
        const monthSubmissoes = submissoes.filter(s => {
          const submissaoDate = new Date(s.data_submissao);
          return submissaoDate.getMonth() === monthIndex && submissaoDate.getFullYear() === new Date().getFullYear();
        });
        
        const total = monthSubmissoes.length;
        const aprovadas = monthSubmissoes.filter(s => s.estado === 'aprovado').length;
        const pendentes = monthSubmissoes.filter(s => s.estado === 'pendente' || s.estado === 'submetido').length;
        
        trends.push({
          mes: monthName,
          total,
          aprovadas,
          pendentes,
          taxaAprovacao: total > 0 ? (aprovadas / total) * 100 : 0
        });
      }
      
      // Adicionar análise de tendências
      this.doc.setFontSize(16);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Análise de Tendências Mensais', 50, currentY);
      currentY += 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      
      const trendData = trends.map(t => [
        t.mes,
        t.total.toString(),
        t.aprovadas.toString(),
        t.pendentes.toString(),
        `${t.taxaAprovacao.toFixed(1)}%`
      ]);
      
      this.addTable([
        ['Mês', 'Total', 'Aprovadas', 'Pendentes', 'Taxa Aprovação'],
        ...trendData
      ], 50, currentY, 500);
      currentY += (trendData.length + 1) * 20 + 40;
      
      // Análise de padrões
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Análise de Padrões', 50, currentY);
      currentY += 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      
      const avgMonthly = trends.reduce((acc, t) => acc + t.total, 0) / trends.length;
      const avgApprovalRate = trends.reduce((acc, t) => acc + t.taxaAprovacao, 0) / trends.length;
      
      const patterns = [
        ['Média Mensal de Submissões', avgMonthly.toFixed(1)],
        ['Taxa Média de Aprovação', `${avgApprovalRate.toFixed(1)}%`],
        ['Mês com Mais Submissões', trends.reduce((max, t) => t.total > max.total ? t : max).mes],
        ['Mês com Menos Submissões', trends.reduce((min, t) => t.total < min.total ? t : min).mes]
      ];
      
      this.addTable(patterns, 50, currentY, 400);
      
      this.addFooter();
      this.doc.save('relatorio_tendencias_submissao_materiais.pdf');
      
    } catch (error) {
      console.error('Erro ao gerar relatório de tendências:', error);
      throw error;
    }
  }
  
  public async generateSubmissaoMateriaisAnomaliesReport(submissoes: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório de Anomalias', 'Submissão de Materiais');
      
      let currentY = 100;
      
      // Deteção de anomalias
      const anomalias = [];
      
      // Submissões urgentes há muito tempo
      const urgentesAntigas = submissoes.filter(s => {
        const dataSubmissao = new Date(s.data_submissao);
        const daysDiff = (new Date().getTime() - dataSubmissao.getTime()) / (1000 * 3600 * 24);
        return s.urgencia === 'urgente' && daysDiff > 7 && s.estado !== 'aprovado';
      });
      
      urgentesAntigas.forEach(s => {
        anomalias.push({
          tipo: 'Urgente Antiga',
          descricao: `Submissão urgente há ${Math.floor((new Date().getTime() - new Date(s.data_submissao).getTime()) / (1000 * 3600 * 24))} dias`,
          prioridade: 'alta',
          submissao: s
        });
      });
      
      // Submissões com alto impacto
      const altoImpacto = submissoes.filter(s => {
        return (s.impacto_custo && s.impacto_custo > 50000) || (s.impacto_prazo && s.impacto_prazo > 30);
      });
      
      altoImpacto.forEach(s => {
        anomalias.push({
          tipo: 'Alto Impacto',
          descricao: `Impacto: Custo ${s.impacto_custo || 0}€, Prazo ${s.impacto_prazo || 0} dias`,
          prioridade: 'alta',
          submissao: s
        });
      });
      
      // Submissões sem documentação
      const semDocumentacao = submissoes.filter(s => {
        return !s.documentos_anexos || s.documentos_anexos.length === 0;
      });
      
      semDocumentacao.forEach(s => {
        anomalias.push({
          tipo: 'Sem Documentação',
          descricao: 'Submissão sem documentos anexos',
          prioridade: 'media',
          submissao: s
        });
      });
      
      // Adicionar resumo de anomalias
      this.doc.setFontSize(16);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Resumo de Anomalias Detetadas', 50, currentY);
      currentY += 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      
      const resumo = [
        ['Tipo de Anomalia', 'Quantidade', 'Prioridade'],
        ['Urgentes Antigas', urgentesAntigas.length.toString(), 'Alta'],
        ['Alto Impacto', altoImpacto.length.toString(), 'Alta'],
        ['Sem Documentação', semDocumentacao.length.toString(), 'Média']
      ];
      
      this.addTable(resumo, 50, currentY, 400);
      currentY += (resumo.length) * 20 + 40;
      
      // Detalhes das anomalias
      if (anomalias.length > 0) {
        this.doc.setFontSize(14);
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Detalhes das Anomalias', 50, currentY);
        currentY += 30;
        
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');
        
        anomalias.forEach((anomalia, index) => {
          if (currentY > 700) {
            this.doc.addPage();
            currentY = 50;
          }
          
          this.doc.setFont(undefined, 'bold');
          this.doc.text(`${index + 1}. ${anomalia.tipo}`, 50, currentY);
          currentY += 15;
          
          this.doc.setFont(undefined, 'normal');
          this.doc.text(`Descrição: ${anomalia.descricao}`, 60, currentY);
          currentY += 15;
          
          this.doc.text(`Submissão: ${anomalia.submissao.codigo} - ${anomalia.submissao.titulo}`, 60, currentY);
          currentY += 15;
          
          this.doc.text(`Prioridade: ${anomalia.prioridade}`, 60, currentY);
          currentY += 25;
        });
      }
      
      // Recomendações
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Recomendações', 50, currentY);
      currentY += 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      
      const recomendacoes = [
        'Revisar submissões urgentes pendentes há mais de 7 dias',
        'Analisar submissões com alto impacto financeiro ou de prazo',
        'Solicitar documentação para submissões sem anexos',
        'Implementar alertas automáticos para anomalias'
      ];
      
      recomendacoes.forEach((rec, index) => {
        this.doc.text(`${index + 1}. ${rec}`, 50, currentY);
        currentY += 20;
      });
      
      this.addFooter();
      this.doc.save('relatorio_anomalias_submissao_materiais.pdf');
      
    } catch (error) {
      console.error('Erro ao gerar relatório de anomalias:', error);
      throw error;
    }
  }

  public async generateRFIsIndividualReport(rfis: any[]): Promise<void> {
    try {
      if (rfis.length === 0) {
        throw new Error('Nenhum RFI fornecido para o relatório individual');
      }
      
      const rfi = rfis[0]; // Pega o primeiro RFI
      
      this.addPremiumHeader('Relatório Individual', `RFI ${rfi.numero} - ${rfi.titulo}`);
      
      let currentY = 100;
      
      // Detalhes do RFI
      const details = [
        ['Número', rfi.numero || 'N/A'],
        ['Título', rfi.titulo || 'N/A'],
        ['Descrição', rfi.descricao || 'N/A'],
        ['Solicitante', rfi.solicitante || 'N/A'],
        ['Destinatário', rfi.destinatario || 'N/A'],
        ['Status', rfi.status || 'N/A'],
        ['Prioridade', rfi.prioridade || 'N/A'],
        ['Data Solicitação', new Date(rfi.data_solicitacao || new Date()).toLocaleDateString('pt-PT')],
        ['Data Resposta', rfi.data_resposta ? new Date(rfi.data_resposta).toLocaleDateString('pt-PT') : 'N/A'],
        ['Resposta', rfi.resposta || 'N/A'],
        ['Impacto Custo', rfi.impacto_custo ? `€${rfi.impacto_custo}` : 'N/A'],
        ['Impacto Prazo', rfi.impacto_prazo ? `${rfi.impacto_prazo} dias` : 'N/A'],
        ['Observações', rfi.observacoes || 'N/A']
      ];
      
      this.addPremiumTable(['Campo', 'Valor'], details, currentY, 'Detalhes do RFI');
      
      this.addPremiumFooter();
      this.save();
    } catch (error) {
      console.error('Erro ao gerar relatório individual de RFI:', error);
      throw error;
    }
  }

  public async generateRFIsPerformanceReport(rfis: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório de Performance', 'RFIs - KPIs e Métricas');
      
      // Calcular métricas de performance
      const total = rfis.length;
      const pendentes = rfis.filter(r => r.status === 'pendente').length;
      const respondidos = rfis.filter(r => r.status === 'respondido').length;
      const urgentes = rfis.filter(r => r.prioridade === 'urgente' || r.prioridade === 'alta').length;
      const taxaResolucao = total > 0 ? (respondidos / total) * 100 : 0;
      
      const stats = {
        mesAtual: total,
        mesAnterior: Math.floor(total * 0.85),
        variacao: Math.floor(total * 0.15),
        totalGeral: total
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Métricas de Performance
      currentY += 20;
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Métricas de Performance', 50, currentY);
      
      currentY += 15;
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      
      const performanceData = [
        ['Métrica', 'Valor', 'Status'],
        ['Total RFIs', total.toString(), 'Atual'],
        ['Pendentes', pendentes.toString(), 'Atenção'],
        ['Respondidos', respondidos.toString(), 'Bom'],
        ['Urgentes', urgentes.toString(), 'Crítico'],
        ['Taxa Resolução', `${taxaResolucao.toFixed(1)}%`, taxaResolucao > 80 ? 'Excelente' : 'Melhorar']
      ];
      
      this.addPremiumTable(['Métrica', 'Valor', 'Status'], performanceData, currentY);
      
      this.addPremiumFooter();
      this.save('RFIs_Performance_Report.pdf');
    } catch (error) {
      console.error('Erro ao gerar relatório de performance RFIs:', error);
      throw error;
    }
  }

  public async generateRFIsTrendsReport(rfis: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório de Tendências', 'RFIs - Análise Temporal');
      
      // Análise de tendências por mês
      const monthlyData = this.analyzeMonthlyTrends(rfis);
      
      const stats = {
        mesAtual: rfis.length,
        mesAnterior: Math.floor(rfis.length * 0.9),
        variacao: Math.floor(rfis.length * 0.1),
        totalGeral: rfis.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Tendências Mensais
      currentY += 20;
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Tendências Mensais', 50, currentY);
      
      currentY += 15;
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      
      const trendsData = monthlyData.map(month => [
        month.month,
        month.total.toString(),
        month.pendentes.toString(),
        month.respondidos.toString(),
        month.trend
      ]);
      
      this.addPremiumTable(
        ['Mês', 'Total', 'Pendentes', 'Respondidos', 'Tendência'],
        trendsData,
        currentY
      );
      
      this.addPremiumFooter();
      this.save('RFIs_Trends_Report.pdf');
    } catch (error) {
      console.error('Erro ao gerar relatório de tendências RFIs:', error);
      throw error;
    }
  }

  public async generateRFIsAnomaliesReport(rfis: any[]): Promise<void> {
    try {
      this.addPremiumHeader('Relatório de Anomalias', 'RFIs - Itens Críticos');
      
      // Identificar anomalias
      const anomalias = this.identifyAnomalies(rfis);
      
      const stats = {
        mesAtual: anomalias.length,
        mesAnterior: Math.floor(anomalias.length * 0.8),
        variacao: Math.floor(anomalias.length * 0.2),
        totalGeral: anomalias.length
      };
      
      let currentY = this.addStatisticsSection(stats, 100);
      
      // Lista de Anomalias
      currentY += 20;
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Anomalias Identificadas', 50, currentY);
      
      currentY += 15;
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      
      const anomaliesData = anomalias.map(anomalia => [
        anomalia.numero,
        anomalia.titulo,
        anomalia.tipo,
        anomalia.severidade,
        anomalia.descricao
      ]);
      
      this.addPremiumTable(
        ['Número', 'Título', 'Tipo', 'Severidade', 'Descrição'],
        anomaliesData,
        currentY
      );
      
      this.addPremiumFooter();
      this.save('RFIs_Anomalies_Report.pdf');
    } catch (error) {
      console.error('Erro ao gerar relatório de anomalias RFIs:', error);
      throw error;
    }
  }

  private analyzeMonthlyTrends(rfis: any[]) {
    const monthlyData = [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    for (let i = 0; i < 6; i++) {
      const monthIndex = new Date().getMonth() - i;
      const monthName = months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
      const monthRFIs = rfis.filter(rfi => {
        const rfiDate = new Date(rfi.data_solicitacao);
        return rfiDate.getMonth() === monthIndex;
      });
      
      const total = monthRFIs.length;
      const pendentes = monthRFIs.filter(r => r.status === 'pendente').length;
      const respondidos = monthRFIs.filter(r => r.status === 'respondido').length;
      
      let trend = 'Estável';
      if (i > 0) {
        const prevMonth = monthlyData[i - 1];
        if (total > prevMonth.total * 1.2) trend = 'Crescimento';
        else if (total < prevMonth.total * 0.8) trend = 'Decréscimo';
      }
      
      monthlyData.unshift({
        month: monthName,
        total,
        pendentes,
        respondidos,
        trend
      });
    }
    
    return monthlyData;
  }

  private identifyAnomalies(rfis: any[]) {
    const anomalias = [];
    
    // RFIs com prioridade urgente há mais de 7 dias
    const urgentesAntigas = rfis.filter(rfi => {
      const rfiDate = new Date(rfi.data_solicitacao);
      const daysDiff = (new Date().getTime() - rfiDate.getTime()) / (1000 * 3600 * 24);
      return (rfi.prioridade === 'urgente' || rfi.prioridade === 'alta') && daysDiff > 7;
    });
    
    urgentesAntigas.forEach(rfi => {
      anomalias.push({
        numero: rfi.numero,
        titulo: rfi.titulo,
        tipo: 'Urgente Antiga',
        severidade: 'Alta',
        descricao: `RFI urgente há ${Math.floor((new Date().getTime() - new Date(rfi.data_solicitacao).getTime()) / (1000 * 3600 * 24))} dias`
      });
    });
    
    // RFIs sem resposta há muito tempo
    const semResposta = rfis.filter(rfi => {
      const rfiDate = new Date(rfi.data_solicitacao);
      const daysDiff = (new Date().getTime() - rfiDate.getTime()) / (1000 * 3600 * 24);
      return rfi.status === 'pendente' && daysDiff > 14;
    });
    
    semResposta.forEach(rfi => {
      anomalias.push({
        numero: rfi.numero,
        titulo: rfi.titulo,
        tipo: 'Sem Resposta',
        severidade: 'Média',
        descricao: `Sem resposta há ${Math.floor((new Date().getTime() - new Date(rfi.data_solicitacao).getTime()) / (1000 * 3600 * 24))} dias`
      });
    });
    
    // RFIs com impacto alto
    const impactoAlto = rfis.filter(rfi => {
      return (rfi.impacto_custo && rfi.impacto_custo > 10000) || 
             (rfi.impacto_prazo && rfi.impacto_prazo > 30);
    });
    
    impactoAlto.forEach(rfi => {
      anomalias.push({
        numero: rfi.numero,
        titulo: rfi.titulo,
        tipo: 'Alto Impacto',
        severidade: 'Alta',
        descricao: `Impacto: Custo ${rfi.impacto_custo || 0}€, Prazo ${rfi.impacto_prazo || 0} dias`
      });
    });
    
    return anomalias;
  }

  // Métodos auxiliares para relatórios de Submissão de Materiais
  private addTable(data: string[][], x: number, y: number, width: number) {
    const cellHeight = 20;
    const cellWidth = width / data[0].length;
    
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellX = x + (colIndex * cellWidth);
        const cellY = y + (rowIndex * cellHeight);
        
        // Draw cell border
        this.doc.rect(cellX, cellY, cellWidth, cellHeight, 'S');
        
        // Add text
        this.doc.setFontSize(10);
        this.doc.text(cell, cellX + 5, cellY + 12);
      });
    });
  }

  private addPieChart(data: { label: string; value: number }[], x: number, y: number, size: number) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    data.forEach((item, index) => {
      const color = this.getChartColor(index);
      
      // Draw pie slice (simplified as rectangle for now)
      this.doc.setFillColor(color.r, color.g, color.b);
      this.doc.rect(x + (index * 30), y, 20, 20, 'F');
      
      // Add label
      this.doc.setFontSize(8);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${item.label}: ${item.value}`, x + (index * 30), y + 25);
    });
  }

  private getChartColor(index: number) {
    const colors = [
      { r: 59, g: 130, b: 246 },   // Blue
      { r: 16, g: 185, b: 129 },   // Green
      { r: 245, g: 158, b: 11 },   // Yellow
      { r: 239, g: 68, b: 68 },    // Red
      { r: 139, g: 92, b: 246 },   // Purple
      { r: 236, g: 72, b: 153 },   // Pink
    ];
    return colors[index % colors.length];
  }

  private addHeader(title: string) {
    // Logo
    if (this.logoImage) {
      this.doc.addImage(this.logoImage, 'PNG', 20, 10, 30, 15);
    }
    
    // Title
    this.doc.setFontSize(20);
    this.doc.setTextColor(30, 64, 175);
    this.doc.text(title, 60, 20);
    
    // Company info
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text(this.config.empresa.nome, 60, 30);
    this.doc.text(this.config.empresa.email, 60, 35);
    
    // Date
    this.doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 400, 20);
  }

  private addFooter() {
    const pageHeight = this.doc.internal.pageSize.height;
    this.doc.setFontSize(10);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text(`Gerado em ${new Date().toLocaleDateString('pt-PT')}`, 50, pageHeight - 20);
    this.doc.text('Qualicore - Sistema de Gestão', 400, pageHeight - 20);
  }

  // Métodos para relatórios de Checklists
  async generateChecklistsPerformanceReport(data: {
    checklists: any[];
    kpis: any;
    trends: any;
    anomalies: any[];
  }) {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Header
    this.addHeader('Relatório de Performance - Checklists');
    
    // KPIs Section
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 64, 175);
    this.doc.text('KPIs Principais', 20, 60);
    
    const kpiData = [
      ['Métrica', 'Valor', 'Status'],
      ['Total Checklists', data.kpis.total.toString(), 'Ativo'],
      ['Taxa Conformidade', `${data.kpis.taxaConformidade.toFixed(1)}%`, data.kpis.taxaConformidade > 80 ? 'Bom' : 'Atenção'],
      ['Taxa Completude', `${data.kpis.taxaCompletude.toFixed(1)}%`, data.kpis.taxaCompletude > 70 ? 'Bom' : 'Atenção'],
      ['Tendência', `${data.trends.crescimentoMensal.toFixed(1)}%`, data.trends.tendencia === 'crescente' ? 'Positiva' : 'Negativa']
    ];
    
    autoTable(this.doc, {
      startY: 70,
      head: [kpiData[0]],
      body: kpiData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] }
    });
    
    // Status Distribution
    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 64, 175);
    this.doc.text('Distribuição por Status', 20, 140);
    
    const statusData = [
      ['Status', 'Quantidade', 'Percentagem'],
      ['Completados', data.kpis.completados.toString(), `${((data.kpis.completados / data.kpis.total) * 100).toFixed(1)}%`],
      ['Em Progresso', data.kpis.emProgresso.toString(), `${((data.kpis.emProgresso / data.kpis.total) * 100).toFixed(1)}%`],
      ['Pendentes', data.kpis.pendentes.toString(), `${((data.kpis.pendentes / data.kpis.total) * 100).toFixed(1)}%`]
    ];
    
    autoTable(this.doc, {
      startY: 150,
      head: [statusData[0]],
      body: statusData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] }
    });
    
    // Anomalies Section
    if (data.anomalies.length > 0) {
      this.doc.setFontSize(14);
      this.doc.setTextColor(239, 68, 68);
      this.doc.text('Anomalias Detectadas', 20, 220);
      
      const anomalyData = data.anomalies.map(anomaly => [
        anomaly.type,
        anomaly.severity,
        anomaly.message
      ]);
      
      autoTable(this.doc, {
        startY: 230,
        head: [['Tipo', 'Severidade', 'Descrição']],
        body: anomalyData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }
      });
    }
    
    this.addFooter();
    this.doc.save('relatorio-performance-checklists.pdf');
  }

  async generateChecklistsTrendsReport(data: {
    checklists: any[];
    trends: any;
    recommendations: any[];
  }) {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Header
    this.addHeader('Relatório de Tendências - Checklists');
    
    // Trends Section
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 64, 175);
    this.doc.text('Análise de Tendências', 20, 60);
    
    const trendsData = [
      ['Métrica', 'Valor', 'Interpretação'],
      ['Crescimento Mensal', `${data.trends.crescimentoMensal.toFixed(1)}%`, data.trends.crescimentoMensal > 0 ? 'Positivo' : 'Negativo'],
      ['Crescimento Semanal', `${data.trends.crescimentoSemanal.toFixed(1)}%`, data.trends.crescimentoSemanal > 0 ? 'Positivo' : 'Negativo'],
      ['Média Diária', `${data.trends.mediaDiaria.toFixed(1)}`, 'Checklists por dia'],
      ['Tendência Geral', data.trends.tendencia, data.trends.tendencia === 'crescente' ? 'Melhorando' : 'Piorando']
    ];
    
    autoTable(this.doc, {
      startY: 70,
      head: [trendsData[0]],
      body: trendsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] }
    });
    
    // Recommendations Section
    if (data.recommendations.length > 0) {
      this.doc.setFontSize(14);
      this.doc.setTextColor(16, 185, 129);
      this.doc.text('Recomendações', 20, 140);
      
      const recData = data.recommendations.map(rec => [
        rec.title,
        rec.priority,
        rec.description
      ]);
      
      autoTable(this.doc, {
        startY: 150,
        head: [['Título', 'Prioridade', 'Descrição']],
        body: recData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }
      });
    }
    
    this.addFooter();
    this.doc.save('relatorio-tendencias-checklists.pdf');
  }

  async generateChecklistsAnomaliesReport(data: {
    checklists: any[];
    anomalies: any[];
    recommendations: any[];
  }) {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Header
    this.addHeader('Relatório de Anomalias - Checklists');
    
    // Anomalies Section
    this.doc.setFontSize(16);
    this.doc.setTextColor(239, 68, 68);
    this.doc.text('Anomalias Detectadas', 20, 60);
    
    if (data.anomalies.length > 0) {
      const anomalyData = data.anomalies.map(anomaly => [
        anomaly.type,
        anomaly.severity,
        anomaly.message,
        anomaly.recommendation
      ]);
      
      autoTable(this.doc, {
        startY: 70,
        head: [['Tipo', 'Severidade', 'Mensagem', 'Recomendação']],
        body: anomalyData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }
      });
    } else {
      this.doc.setFontSize(12);
      this.doc.setTextColor(16, 185, 129);
      this.doc.text('Nenhuma anomalia detectada - Sistema funcionando normalmente', 20, 80);
    }
    
    // Recommendations Section
    if (data.recommendations.length > 0) {
      this.doc.setFontSize(14);
      this.doc.setTextColor(16, 185, 129);
      this.doc.text('Recomendações de Melhoria', 20, 140);
      
      const recData = data.recommendations.map(rec => [
        rec.title,
        rec.priority,
        rec.impact,
        rec.effort
      ]);
      
      autoTable(this.doc, {
        startY: 150,
        head: [['Título', 'Prioridade', 'Impacto', 'Esforço']],
        body: recData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }
      });
    }
    
    this.addFooter();
    this.doc.save('relatorio-anomalias-checklists.pdf');
  }

  async generateChecklistsIndividualReport(checklists: any[]): Promise<void> {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Header
    this.addHeader('Relatório Individual - Checklists');
    
    // Individual Checklist Details
    this.doc.setFontSize(16);
    this.doc.setTextColor(30, 64, 175);
    this.doc.text('Detalhes do Checklist', 20, 60);
    
    checklists.forEach((checklist, index) => {
      const startY = 70 + (index * 120);
      
      // Basic Info
      this.doc.setFontSize(12);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`Código: ${checklist.codigo}`, 20, startY);
      this.doc.text(`Título: ${checklist.titulo}`, 20, startY + 10);
      this.doc.text(`Status: ${checklist.status}`, 20, startY + 20);
      this.doc.text(`Responsável: ${checklist.responsavel}`, 20, startY + 30);
      this.doc.text(`Zona: ${checklist.zona}`, 20, startY + 40);
      this.doc.text(`Estado: ${checklist.estado}`, 20, startY + 50);
      
      if (checklist.observacoes) {
        this.doc.text(`Observações: ${checklist.observacoes}`, 20, startY + 60);
      }
      
      // Add page break if needed
      if (startY > 250) {
        this.doc.addPage();
      }
    });
    
    this.addFooter();
    this.doc.save('relatorio-individual-checklists.pdf');
  }
}
