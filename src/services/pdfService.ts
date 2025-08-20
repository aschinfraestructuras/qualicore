import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Material, Fornecedor, Obra } from '@/types';
import { Armadura } from '@/types/armaduras';
import PDFConfigService from './pdfConfigService';

// Configuração premium para PDFs - MELHORADA
interface PDFConfig {
  empresa: {
    nome: string;
    logotipo?: string; // URL ou base64 do logotipo
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
    corPrimaria: string; // Hex color
    corSecundaria: string;
    corTexto: string;
    corFundo: string;
    fonteTitulo: string;
    fonteTexto: string;
  };
}

// Configuração padrão melhorada
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
    corPrimaria: '#3B82F6', // Azul
    corSecundaria: '#1E40AF',
    corTexto: '#1F2937',
    corFundo: '#F8FAFC',
    fonteTitulo: 'helvetica',
    fonteTexto: 'helvetica'
  }
};

interface MetricasReais {
  materiais: {
    taxa_aprovacao: number;
    total_materiais: number;
    materiais_aprovados: number;
    materiais_pendentes: number;
  };
  naoConformidades: {
    taxa_resolucao: number;
    total_ncs: number;
    ncs_resolvidas: number;
    ncs_pendentes: number;
  };
  documentos: {
    total_documentos: number;
    documentos_aprovados: number;
    documentos_vencidos: number;
    documentos_pendentes: number;
  };
}

interface RelatorioMateriaisOptions {
  materiais: Material[];
  titulo?: string;
  subtitulo?: string;
}

interface RelatorioFornecedoresOptions {
  fornecedores: Fornecedor[];
  filtros?: any;
  titulo?: string;
  subtitulo?: string;
}

interface RelatorioArmadurasOptions {
  armaduras: Armadura[];
  titulo?: string;
  subtitulo?: string;
}

export class PDFService {
  private doc: jsPDF;
  private config: PDFConfig;
  private logoImage: HTMLImageElement | null = null;
  private obras: Obra[] = [];

  constructor(config?: Partial<PDFConfig>) {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.config = { ...DEFAULT_PDF_CONFIG, ...config };
    this.loadLogo();
    this.loadObras();
  }

  // Carregar logotipo de forma melhorada
  private async loadLogo(): Promise<void> {
    if (!this.config.empresa.logotipo) return;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.logoImage = img;
        resolve();
      };
      
      img.onerror = () => {
        console.warn('Erro ao carregar logotipo, usando fallback');
        this.logoImage = null;
        resolve();
      };

      // Se for base64, usar diretamente
      if (this.config.empresa.logotipo.startsWith('data:')) {
        img.src = this.config.empresa.logotipo;
      } else {
        // Se for URL, tentar carregar
        img.src = this.config.empresa.logotipo;
      }
    });
  }

  // Carregar obras disponíveis
  private async loadObras(): Promise<void> {
    try {
      // Aqui você pode integrar com a API de obras
      // Por enquanto, vamos usar dados mock
      this.obras = [
        {
          id: "1",
          codigo: "OBR-2024-001",
          nome: "Edifício Residencial Solar",
          cliente: "Construtora ABC",
          localizacao: "Lisboa, Portugal",
          data_inicio: "2024-01-15",
          data_fim_prevista: "2024-12-31",
          valor_contrato: 2500000,
          valor_executado: 1250000,
          percentual_execucao: 50,
          status: "em_execucao",
          tipo_obra: "residencial",
          categoria: "grande",
          responsavel_tecnico: "Eng. João Silva",
          coordenador_obra: "Eng. Maria Santos",
          fiscal_obra: "Eng. Carlos Mendes",
          engenheiro_responsavel: "Eng. Ana Costa",
          arquiteto: "Arq. Pedro Alves",
          fornecedores_principais: [],
          observacoes: null,
          created_at: "",
          updated_at: ""
        } as any
      ];
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
    }
  }

  // Método para carregar logotipo
  public async loadLogotipo(logotipoUrl: string): Promise<void> {
    if (!logotipoUrl || !logotipoUrl.startsWith('data:image')) {
      console.log('❌ URL do logotipo inválida');
      return;
    }

    try {
      // Criar uma imagem para verificar se é válida
      const img = new Image();
      img.src = logotipoUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          this.logoImage = img;
          console.log('✅ Logotipo carregado com sucesso:', img.width, 'x', img.height);
          resolve(true);
        };
        img.onerror = () => {
          console.log('❌ Erro ao carregar logotipo');
          reject(new Error('Erro ao carregar logotipo'));
        };
      });
    } catch (error) {
      console.log('❌ Erro ao processar logotipo:', error);
    }
  }

  // Método para atualizar configuração
  public updateConfig(newConfig: Partial<PDFConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Se há logotipo, carregá-lo
    if (newConfig.empresa?.logotipo) {
      this.loadLogotipo(newConfig.empresa.logotipo);
    }
  }

  public setLogotipo(logotipoUrl: string): void {
    this.config.empresa.logotipo = logotipoUrl;
    this.loadLogo();
  }

  public setEmpresa(empresa: Partial<PDFConfig['empresa']>): void {
    this.config.empresa = { ...this.config.empresa, ...empresa };
  }

  public setObra(obra: PDFConfig['obra']): void {
    this.config.obra = obra;
  }

  public getObras(): Obra[] {
    return this.obras;
  }

  // Cabeçalho premium MUITO MELHORADO
  private addPremiumHeader(titulo: string, subtitulo?: string) {
    const { empresa, obra, design } = this.config;
    
    // Converter cores hex para RGB
    const primaryColor = this.hexToRgb(design.corPrimaria);
    const secondaryColor = this.hexToRgb(design.corSecundaria);
    
    // Fundo principal com gradiente
    this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    this.doc.rect(0, 0, 210, 80, 'F');
    
    // Linhas decorativas
    this.doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    this.doc.rect(0, 0, 210, 4, 'F');
    this.doc.rect(0, 76, 210, 4, 'F');
    
    // Elementos decorativos geométricos
    this.doc.setFillColor(255, 255, 255, 0.1);
    this.doc.circle(30, 20, 8, 'F');
    this.doc.circle(180, 15, 6, 'F');
    this.doc.circle(190, 60, 4, 'F');
    
    // Logotipo melhorado com verificação robusta
    if (empresa.logotipo && empresa.logotipo.startsWith('data:image')) {
      try {
        const logoWidth = 35;
        const logoHeight = 35;
        const logoY = 20;
        const logoX = 20;
        
        // Fundo circular para o logotipo
        this.doc.setFillColor(255, 255, 255, 0.3);
        this.doc.circle(logoX + logoWidth/2, logoY + logoHeight/2, logoWidth/2 + 5, 'F');
        
        // Adicionar imagem
        this.doc.addImage(empresa.logotipo, 'PNG', logoX, logoY, logoWidth, logoHeight);
        console.log('✅ Logotipo adicionado com sucesso');
      } catch (error) {
        console.log('❌ Erro ao adicionar logotipo:', error);
        this.addCompanyTextFallback(empresa.nome, 30, 40);
      }
    } else {
      this.addCompanyTextFallback(empresa.nome, 30, 40);
    }
    
    // Informações da empresa (lado direito)
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(empresa.morada, 170, 25);
    this.doc.text(empresa.telefone, 170, 30);
    this.doc.text(empresa.email, 170, 35);
    if (empresa.website) {
      this.doc.text(empresa.website, 170, 40);
    }
    
    // Título principal (centro)
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(titulo, 105, 55, { align: 'center' });
    
    // Subtítulo
    if (subtitulo) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(subtitulo, 105, 65, { align: 'center' });
    }
    
    // Informações da obra (se disponível) - SEM EMOJIS para evitar caracteres estranhos
    if (obra) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Obra: ${obra.nome}`, 105, 70, { align: 'center' });
      this.doc.text(`${obra.localizacao} | Cliente: ${obra.cliente}`, 105, 75, { align: 'center' });
    }
  }

  // Método para adicionar texto da empresa como fallback
  private addCompanyTextFallback(nome: string, x: number, y: number) {
    this.doc.setFontSize(22);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(nome, x, y);
  }

  // Rodapé premium MUITO MELHORADO
  private addPremiumFooter() {
    const { empresa, design } = this.config;
    const pageCount = (this.doc as any).getNumberOfPages();
    
    // Converter cores hex para RGB
    const primaryColor = this.hexToRgb(design.corPrimaria);
    const secondaryColor = this.hexToRgb(design.corSecundaria);
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Fundo do rodapé
      this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.rect(0, 280, 210, 20, 'F');
      
      // Linha decorativa superior
      this.doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      this.doc.rect(0, 280, 210, 3, 'F');
      
      // Elementos decorativos
      this.doc.setFillColor(255, 255, 255, 0.1);
      this.doc.circle(25, 290, 3, 'F');
      this.doc.circle(185, 290, 3, 'F');
      
      // Texto do rodapé SEM EMOJIS
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

  // Tabela premium MUITO MELHORADA - sem cortes
  private addPremiumTable(headers: string[], data: any[][], startY: number, title?: string) {
    const { design } = this.config;
    
    if (title) {
      this.doc.setFontSize(16);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, 20, startY);
      startY += 15;
    }
    
    // Converter cores hex para RGB
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Usar autoTable com configuração MUITO melhorada
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
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
        textColor: [31, 41, 55]
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'auto',
        lineColor: [229, 231, 235],
        lineWidth: 0.2
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'left' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 25, halign: 'center' },
        6: { cellWidth: 30, halign: 'left' },
        7: { cellWidth: 30, halign: 'left' }
      },
      margin: { left: 10, right: 10, top: 5 },
      tableWidth: 190,
      pageBreak: 'auto',
      willDrawPage: (data) => {
        // Adicionar cabeçalho em cada página se necessário
        if (data.pageNumber > 1) {
          this.addPremiumHeader('Continuação', 'Página ' + data.pageNumber);
        }
      }
    });
    
    return (this.doc as any).lastAutoTable.finalY + 20;
  }

  // Função auxiliar para converter hex para RGB
  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [59, 130, 246]; // Fallback azul
  }

  // Gráfico de barras elaborado
  private addElaborateBarChart(data: { label: string; value: number }[], startY: number, title: string) {
    const { design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Título do gráfico
    this.doc.setFontSize(14);
    this.doc.setTextColor(design.corTexto);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, startY);
    startY += 10;
    
    const chartWidth = 170;
    const chartHeight = 60;
    const barWidth = chartWidth / data.length;
    const maxValue = Math.max(...data.map(d => d.value));
    
    // Fundo do gráfico
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(20, startY, chartWidth, chartHeight, 'F');
    
    // Bordas
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, startY, chartWidth, chartHeight);
    
    // Barras
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (chartHeight - 20);
      const x = 25 + (index * barWidth);
      const y = startY + chartHeight - barHeight - 10;
      
      // Barra com gradiente
      this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.rect(x, y, barWidth - 2, barHeight, 'F');
      
      // Valor no topo da barra
      this.doc.setFontSize(8);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.value.toString(), x + (barWidth - 2) / 2, y - 2, { align: 'center' });
      
      // Label abaixo da barra
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.label, x + (barWidth - 2) / 2, startY + chartHeight + 5, { align: 'center' });
    });
    
    return startY + chartHeight + 20;
  }

  // Seção de estatísticas SEM EMOJIS
  private addStatisticsSection(stats: { label: string; value: string; icon: string }[], startY: number) {
    const { design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(design.corTexto);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Estatisticas Principais', 20, startY);
    startY += 15;
    
    const cardWidth = 85;
    const cardHeight = 35;
    const cardsPerRow = 2;
    
    stats.forEach((stat, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = 20 + (col * (cardWidth + 10));
      const y = startY + (row * (cardHeight + 10));
      
      // Fundo do card
      this.doc.setFillColor(248, 250, 252);
      this.doc.rect(x, y, cardWidth, cardHeight, 'F');
      
      // Borda
      this.doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.setLineWidth(0.5);
      this.doc.rect(x, y, cardWidth, cardHeight);
      
      // Valor (sem ícone para evitar caracteres estranhos)
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(design.corTexto);
      this.doc.text(stat.value, x + 5, y + 12);
      
      // Label
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(stat.label, x + 5, y + 25);
    });
    
    return startY + (Math.ceil(stats.length / cardsPerRow) * (cardHeight + 10)) + 10;
  }

  // Assinatura profissional
  private addProfessionalSignature(startY: number, nome: string, cargo: string) {
    const { design } = this.config;
    
    // Linha de assinatura
    this.doc.setDrawColor(design.corTexto);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, startY, 80, startY);
    
    // Nome
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(design.corTexto);
    this.doc.text(nome, 20, startY + 8);
    
    // Cargo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(107, 114, 128);
    this.doc.text(cargo, 20, startY + 15);
    
    return startY + 25;
  }

  // Métodos de compatibilidade
  private addHeader(titulo: string) {
    this.addPremiumHeader(titulo);
  }

  private addFooter() {
    this.addPremiumFooter();
  }

  // Cabeçalho premium MUITO MELHORADO
  private addPremiumHeader(titulo: string, subtitulo?: string) {
    const { empresa, obra, design } = this.config;
    
    // Converter cores hex para RGB
    const primaryColor = this.hexToRgb(design.corPrimaria);
    const secondaryColor = this.hexToRgb(design.corSecundaria);
    
    // Fundo principal com gradiente
    this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    this.doc.rect(0, 0, 210, 80, 'F');
    
    // Linhas decorativas
    this.doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    this.doc.rect(0, 0, 210, 4, 'F');
    this.doc.rect(0, 76, 210, 4, 'F');
    
    // Elementos decorativos geométricos
    this.doc.setFillColor(255, 255, 255, 0.1);
    this.doc.circle(30, 20, 8, 'F');
    this.doc.circle(180, 15, 6, 'F');
    this.doc.circle(190, 60, 4, 'F');
    
    // Logotipo melhorado
    if (this.logoImage) {
      try {
        const logoWidth = 40;
        const logoHeight = (this.logoImage.height * logoWidth) / this.logoImage.width;
        const logoY = 20;
        const logoX = 25;
        
        // Fundo circular para o logotipo
        this.doc.setFillColor(255, 255, 255, 0.2);
        this.doc.circle(logoX + logoWidth/2, logoY + logoHeight/2, Math.max(logoWidth, logoHeight)/2 + 3, 'F');
        
        this.doc.addImage(this.logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.log('Erro ao adicionar logotipo:', error);
        this.addCompanyTextFallback(empresa.nome, 30, 40);
      }
    } else {
      this.addCompanyTextFallback(empresa.nome, 30, 40);
    }
    
    // Informações da empresa (lado direito)
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(empresa.morada, 170, 25);
    this.doc.text(empresa.telefone, 170, 30);
    this.doc.text(empresa.email, 170, 35);
    if (empresa.website) {
      this.doc.text(empresa.website, 170, 40);
    }
    
    // Título principal (centro)
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(titulo, 105, 55, { align: 'center' });
    
    // Subtítulo
    if (subtitulo) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(subtitulo, 105, 65, { align: 'center' });
    }
    
    // Informações da obra (se disponível)
    if (obra) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`🏗️ Obra: ${obra.nome}`, 105, 70, { align: 'center' });
      this.doc.text(`📍 ${obra.localizacao} | 👤 ${obra.cliente}`, 105, 75, { align: 'center' });
    }
  }

  // Método para adicionar texto da empresa como fallback
  private addCompanyTextFallback(nome: string, x: number, y: number) {
    this.doc.setFontSize(22);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(nome, x, y);
  }

  // Rodapé premium MUITO MELHORADO
  private addPremiumFooter() {
    const { empresa, design } = this.config;
    const pageCount = (this.doc as any).getNumberOfPages();
    
    // Converter cores hex para RGB
    const primaryColor = this.hexToRgb(design.corPrimaria);
    const secondaryColor = this.hexToRgb(design.corSecundaria);
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Fundo do rodapé
      this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.rect(0, 280, 210, 20, 'F');
      
      // Linha decorativa superior
      this.doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      this.doc.rect(0, 280, 210, 3, 'F');
      
      // Elementos decorativos
      this.doc.setFillColor(255, 255, 255, 0.1);
      this.doc.circle(25, 290, 3, 'F');
      this.doc.circle(185, 290, 3, 'F');
      
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
      
      this.doc.text(`${empresa.nome} | 📞 ${empresa.telefone} | 📧 ${empresa.email}`, 20, 290);
      this.doc.text(`📄 Página ${i} de ${pageCount} | 🕒 Gerado em ${currentTime}`, 20, 295);
      this.doc.text(`🏢 ${empresa.morada}`, 20, 300);
    }
  }

  // Tabela premium MUITO MELHORADA - sem cortes
  private addPremiumTable(headers: string[], data: any[][], startY: number, title?: string) {
    const { design } = this.config;
    
    if (title) {
      this.doc.setFontSize(16);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont(design.fonteTitulo, 'bold');
      this.doc.text(title, 20, startY);
      startY += 15;
    }
    
    // Converter cores hex para RGB
    const primaryColor = this.hexToRgb(design.corPrimaria);
    const secondaryColor = this.hexToRgb(design.corSecundaria);
    
    // Usar autoTable com configuração MUITO melhorada
    autoTable(this.doc, {
      startY: startY,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11,
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
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'center' },
        3: { cellWidth: 'auto', halign: 'center' },
        4: { cellWidth: 'auto', halign: 'center' }
      },
      margin: { left: 15, right: 15, top: 10 },
      tableWidth: 180,
      pageBreak: 'auto',
      willDrawPage: (data) => {
        // Adicionar cabeçalho em cada página se necessário
        if (data.pageNumber > 1) {
          this.addPremiumHeader('Continuação', 'Página ' + data.pageNumber);
        }
      }
      // Removido didDrawPage que estava causando erro com jsPDF.rect
    });
    
    return (this.doc as any).lastAutoTable.finalY + 20;
  }

  // Função auxiliar para converter hex para RGB
  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [59, 130, 246]; // Fallback azul
  }

  // Gráfico de barras elaborado
  private addElaborateBarChart(data: { label: string; value: number }[], startY: number, title: string) {
    const { design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    // Título do gráfico
    this.doc.setFontSize(14);
    this.doc.setTextColor(design.corTexto);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, startY);
    startY += 10;
    
    const chartWidth = 170;
    const chartHeight = 60;
    const barWidth = chartWidth / data.length;
    const maxValue = Math.max(...data.map(d => d.value));
    
    // Fundo do gráfico
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(20, startY, chartWidth, chartHeight, 'F');
    
    // Bordas
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, startY, chartWidth, chartHeight);
    
    // Barras
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (chartHeight - 20);
      const x = 25 + (index * barWidth);
      const y = startY + chartHeight - barHeight - 10;
      
      // Barra com gradiente
      this.doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.rect(x, y, barWidth - 2, barHeight, 'F');
      
      // Valor no topo da barra
      this.doc.setFontSize(8);
      this.doc.setTextColor(design.corTexto);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.value.toString(), x + (barWidth - 2) / 2, y - 2, { align: 'center' });
      
      // Label abaixo da barra
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.label, x + (barWidth - 2) / 2, startY + chartHeight + 5, { align: 'center' });
    });
    
    return startY + chartHeight + 20;
  }

  // Seção de estatísticas
  private addStatisticsSection(stats: { label: string; value: string; icon: string }[], startY: number) {
    const { design } = this.config;
    const primaryColor = this.hexToRgb(design.corPrimaria);
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(design.corTexto);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('📊 Estatísticas Principais', 20, startY);
    startY += 15;
    
    const cardWidth = 85;
    const cardHeight = 35;
    const cardsPerRow = 2;
    
    stats.forEach((stat, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = 20 + (col * (cardWidth + 10));
      const y = startY + (row * (cardHeight + 10));
      
      // Fundo do card
      this.doc.setFillColor(248, 250, 252);
      this.doc.rect(x, y, cardWidth, cardHeight, 'F');
      
      // Borda
      this.doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.setLineWidth(0.5);
      this.doc.rect(x, y, cardWidth, cardHeight);
      
      // Ícone
      this.doc.setFontSize(12);
      this.doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      this.doc.text(stat.icon, x + 5, y + 8);
      
      // Valor
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(design.corTexto);
      this.doc.text(stat.value, x + 20, y + 8);
      
      // Label
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(stat.label, x + 5, y + 20);
    });
    
    return startY + (Math.ceil(stats.length / cardsPerRow) * (cardHeight + 10)) + 10;
  }

  // Assinatura profissional
  private addProfessionalSignature(startY: number, nome: string, cargo: string) {
    const { design } = this.config;
    
    // Linha de assinatura
    this.doc.setDrawColor(design.corTexto);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, startY, 80, startY);
    
    // Nome
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(design.corTexto);
    this.doc.text(nome, 20, startY + 8);
    
    // Cargo
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(107, 114, 128);
    this.doc.text(cargo, 20, startY + 15);
    
    return startY + 25;
  }

  // Métodos de compatibilidade
  private addHeader(titulo: string) {
    this.addPremiumHeader(titulo);
  }

  private addFooter() {
    this.addPremiumFooter();
  }

  // Método para baixar o PDF
  private save(filename?: string): void {
    const defaultFilename = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(filename || defaultFilename);
  }

  public async generateArmadurasExecutiveReport(armaduras: Armadura[]): Promise<void> {
    try {
      // Criar novo documento
      this.doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Adicionar cabeçalho premium
      this.addPremiumHeader('Relatório Executivo', 'Armaduras - Visão Geral');
      
      let currentY = 90;
      
      // Estatísticas principais
      const stats = [
        { label: 'Total de Armaduras', value: armaduras.length.toString(), icon: '📊' },
        { label: 'Aprovadas', value: armaduras.filter(a => a.estado === 'aprovado').length.toString(), icon: '✅' },
        { label: 'Pendentes', value: armaduras.filter(a => a.estado === 'pendente').length.toString(), icon: '⏳' },
        { label: 'Peso Total', value: `${armaduras.reduce((sum, a) => sum + a.peso_total, 0).toFixed(2)} kg`, icon: '⚖️' }
      ];
      
      currentY = this.addStatisticsSection(stats, currentY) + 10;
      
      // Distribuição por estado
      const estadoData = armaduras.reduce((acc, a) => {
        acc[a.estado] = (acc[a.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const chartData = Object.entries(estadoData).map(([estado, count]) => ({
        label: estado.charAt(0).toUpperCase() + estado.slice(1),
        value: count
      }));
      
      if (chartData.length > 0) {
        currentY = this.addElaborateBarChart(chartData, currentY, 'Distribuição por Estado') + 10;
      }
      
      // Tabela resumida das armaduras
      const headers = ['Código', 'Tipo', 'Diâmetro', 'Quantidade', 'Estado', 'Localização'];
      const tableData = armaduras.slice(0, 20).map(a => [
        a.codigo,
        a.tipo,
        `${a.diametro}mm`,
        a.quantidade.toString(),
        a.estado,
        a.local_aplicacao
      ]);
      
      currentY = this.addPremiumTable(headers, tableData, currentY, 'Armaduras Principais (Top 20)') + 20;
      
      // Assinatura
      this.addProfessionalSignature(currentY, 'Responsável Técnico', 'Engenheiro Civil');
      
      // Adicionar rodapé
      this.addPremiumFooter();
      
      // Salvar
      this.save('relatorio-executivo-armaduras-premium.pdf');
      
    } catch (error) {
      console.error('Erro ao gerar relatório executivo de armaduras:', error);
      throw error;
    }
  }

  public async generateArmadurasComparativeReport(armaduras: Armadura[]): Promise<void> {
    try {
      // Criar novo documento
      this.doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Adicionar cabeçalho premium
      this.addPremiumHeader('Relatório Comparativo', 'Armaduras - Análise Temporal');
      
      let currentY = 90;
      
      // Análise temporal (últimos 2 meses)
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const armadurasMesAtual = armaduras.filter(a => {
        const data = new Date(a.created_at);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      });
      
      const armadurasMesAnterior = armaduras.filter(a => {
        const data = new Date(a.created_at);
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        return data.getMonth() === mesAnterior && data.getFullYear() === anoAnterior;
      });
      
      // Estatísticas comparativas
      const statsComparativas = [
        { label: 'Mês Atual', value: armadurasMesAtual.length.toString(), icon: '📊' },
        { label: 'Mês Anterior', value: armadurasMesAnterior.length.toString(), icon: '📈' },
        { label: 'Variação', value: `${armadurasMesAtual.length - armadurasMesAnterior.length > 0 ? '+' : ''}${armadurasMesAtual.length - armadurasMesAnterior.length}`, icon: '📊' },
        { label: 'Total Geral', value: armaduras.length.toString(), icon: '🎯' }
      ];
      
      currentY = this.addStatisticsSection(statsComparativas, currentY) + 10;
      
      // Tabela completa
      const headers = ['Código', 'Tipo', 'Diâmetro', 'Quantidade', 'Peso', 'Estado', 'Data'];
      const tableData = armaduras.map(a => [
        a.codigo,
        a.tipo,
        `${a.diametro}mm`,
        a.quantidade.toString(),
        `${a.peso_total}kg`,
        a.estado,
        new Date(a.created_at).toLocaleDateString('pt-PT')
      ]);
      
      this.addPremiumTable(headers, tableData, currentY, 'Comparativo Detalhado de Armaduras');
      
      // Adicionar rodapé
      this.addPremiumFooter();
      
      // Salvar
      this.save('relatorio-comparativo-armaduras.pdf');
      
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo de armaduras:', error);
      throw error;
    }
  }

  public async generateArmadurasFilteredReport(armaduras: Armadura[], filtros: any): Promise<void> {
    try {
      // Criar novo documento
      this.doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Adicionar cabeçalho premium
      this.addPremiumHeader('Relatório Filtrado', 'Armaduras - Dados Específicos');
      
      let currentY = 90;
      
      // Informações dos filtros aplicados
      if (filtros && Object.keys(filtros).length > 0) {
        this.doc.setFontSize(12);
        this.doc.setTextColor('#374151');
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('🔍 Filtros Aplicados:', 20, currentY);
        currentY += 15;
        
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        Object.entries(filtros).forEach(([key, value]) => {
          if (value) {
            this.doc.text(`• ${key}: ${value}`, 25, currentY);
            currentY += 10;
          }
        });
        currentY += 10;
      }
      
      // Estatísticas dos dados filtrados
      const stats = [
        { label: 'Registros Filtrados', value: armaduras.length.toString(), icon: '📊' },
        { label: 'Aprovadas', value: armaduras.filter(a => a.estado === 'aprovado').length.toString(), icon: '✅' },
        { label: 'Peso Total', value: `${armaduras.reduce((sum, a) => sum + a.peso_total, 0).toFixed(2)} kg`, icon: '⚖️' },
        { label: 'Diferentes Tipos', value: new Set(armaduras.map(a => a.tipo)).size.toString(), icon: '🔗' }
      ];
      
      currentY = this.addStatisticsSection(stats, currentY) + 10;
      
      // Tabela detalhada
      const headers = ['Código', 'Tipo', 'Diâmetro', 'Quantidade', 'Peso Total', 'Estado', 'Localização', 'Responsável'];
      const tableData = armaduras.map(a => [
        a.codigo,
        a.tipo,
        `${a.diametro}mm`,
        a.quantidade.toString(),
        `${a.peso_total}kg`,
        a.estado,
        a.local_aplicacao,
        a.responsavel
      ]);
      
      this.addPremiumTable(headers, tableData, currentY, 'Dados Detalhados das Armaduras');
      
      // Adicionar rodapé
      this.addPremiumFooter();
      
      // Salvar
      this.save('relatorio-filtrado-armaduras.pdf');
      
    } catch (error) {
      console.error('Erro ao gerar relatório filtrado de armaduras:', error);
      throw error;
    }
  }

  public async generateArmadurasIndividualReport(armaduras: Armadura[]): Promise<void> {
    try {
      const armadura = armaduras[0]; // Pegar a primeira armadura
      if (!armadura) {
        throw new Error('Nenhuma armadura fornecida para o relatório individual');
      }
      
      // Criar novo documento
      this.doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Adicionar cabeçalho premium
      this.addPremiumHeader('Relatório Individual', `Armadura ${armadura.codigo}`);
      
      let currentY = 90;
      
      // Detalhes da armadura
      this.doc.setFontSize(14);
      this.doc.setTextColor('#374151');
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('📋 Informações Detalhadas', 20, currentY);
      currentY += 20;
      
      const detalhes = [
        ['Código:', armadura.codigo],
        ['Tipo:', armadura.tipo],
        ['Diâmetro:', `${armadura.diametro}mm`],
        ['Quantidade:', armadura.quantidade.toString()],
        ['Peso Total:', `${armadura.peso_total}kg`],
        ['Fabricante:', armadura.fabricante],
        ['Número da Colada:', armadura.numero_colada],
        ['Estado:', armadura.estado],
        ['Local de Aplicação:', armadura.local_aplicacao],
        ['Responsável:', armadura.responsavel],
        ['Data de Receção:', new Date(armadura.data_rececao).toLocaleDateString('pt-PT')],
        ['Data de Criação:', new Date(armadura.created_at).toLocaleDateString('pt-PT')]
      ];
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      detalhes.forEach(([label, value]) => {
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(label, 20, currentY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(value, 70, currentY);
        currentY += 12;
      });
      
      // Assinatura
      currentY += 20;
      this.addProfessionalSignature(currentY, 'Responsável Técnico', 'Engenheiro Civil');
      
      // Adicionar rodapé
      this.addPremiumFooter();
      
      // Salvar
      this.save(`relatorio-individual-armadura-${armadura.codigo}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar relatório individual de armaduras:', error);
      throw error;
    }
  }
}
