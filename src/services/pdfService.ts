import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Material, Fornecedor } from '@/types';
import { Armadura } from '@/types/armaduras';

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

  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
  }

  private initDocument() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
  }

  private addProfessionalHeader(titulo: string, subtitulo?: string) {
    // Logo ou cabeçalho da empresa
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(0, 0, 210, 30, 'F');
    
    this.doc.setFontSize(20);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('QUALICORE', 20, 20);
    
    this.doc.setFontSize(16);
    this.doc.text(titulo, 20, 40);
    
    if (subtitulo) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(subtitulo, 20, 50);
    }
  }

  private addProfessionalFooter() {
    const pageCount = (this.doc as any).getNumberOfPages();
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128);
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text(`Página ${i} de ${pageCount}`, 20, 290);
      this.doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 120, 290);
    }
  }

  private addHeader(titulo: string) {
    this.doc.setFontSize(20);
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(titulo, 105, 40, { align: 'center' }); // Centralizado
  }

  private addFooter() {
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 105, 290, { align: 'center' }); // Centralizado
  }

  private getTipoTextMaterial(tipo: string): string {
    const tipos = {
      'betao': 'Betão',
      'aco': 'Aço',
      'agregado': 'Agregado',
      'cimento': 'Cimento',
      'outro': 'Outro'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  }

  // Métodos para relatórios de materiais
  public async generateMateriaisExecutiveReport(materiais: Material[]): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Executivo de Materiais');
    
    const startY = 90;
    let currentY = this.addEstatisticasMateriais(materiais, startY);
    currentY = this.addRelatorioExecutivoMateriais({ materiais }, currentY);
    
    this.addFooter();
  }

  public async generateMateriaisFilteredReport(materiais: Material[], filtros: any): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Filtrado de Materiais');
    
    const startY = 90;
    let currentY = this.addFiltrosMateriais(filtros, startY);
    currentY = this.addRelatorioFiltradoMateriais({ materiais }, currentY);
    
    this.addFooter();
  }

  public async generateMateriaisComparativeReport(materiais: Material[]): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Comparativo de Materiais');
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoMateriais({ materiais }, startY);
    
    this.addFooter();
  }

  public async generateMateriaisIndividualReport(materiais: Material[]): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Individual de Material');
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualMaterial({ materiais }, startY);
    
    this.addFooter();
  }

  private addEstatisticasMateriais(materiais: Material[], startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais', 20, startY);
    
    const total = materiais.length;
    const aprovados = materiais.filter(m => m.estado === 'aprovado').length;
    const reprovados = materiais.filter(m => m.estado === 'reprovado').length;
    const emAnalise = materiais.filter(m => m.estado === 'em_analise').length;
    const pendentes = materiais.filter(m => m.estado === 'pendente').length;
    const quantidadeTotal = materiais.reduce((sum, m) => sum + m.quantidade, 0);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    this.doc.text(`Total de Materiais: ${total}`, 20, y);
    y += 8;
    this.doc.text(`Aprovados: ${aprovados} (${((aprovados / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Reprovados: ${reprovados} (${((reprovados / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Em Análise: ${emAnalise} (${((emAnalise / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Pendentes: ${pendentes} (${((pendentes / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Quantidade Total: ${quantidadeTotal.toLocaleString()}`, 20, y);
    
    return y + 20;
  }

  private addRelatorioExecutivoMateriais(options: RelatorioMateriaisOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Tipo', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    const porTipo = options.materiais.reduce((acc, material) => {
      const tipo = material.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let y = startY + 15;
    Object.entries(porTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${this.getTipoTextMaterial(tipo)}: ${quantidade}`, 25, y);
      y += 8;
    });
    
    return y + 20;
  }

  private addFiltrosMateriais(filtros: any, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        this.doc.text(`${key}: ${value}`, 25, y);
        y += 8;
      }
    });
    
    return y + 20;
  }

  private addRelatorioFiltradoMateriais(options: RelatorioMateriaisOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Materiais Filtrados', 20, startY);
    
    return this.addTabelaMateriais(options.materiais, startY + 15);
  }

  private addRelatorioComparativoMateriais(options: RelatorioMateriaisOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    const porTipo = options.materiais.reduce((acc, material) => {
      const tipo = material.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let y = startY + 15;
    Object.entries(porTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${this.getTipoTextMaterial(tipo)}: ${quantidade}`, 20, y);
      y += 8;
    });
    
    return y + 20;
  }

  private addRelatorioIndividualMaterial(options: RelatorioMateriaisOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes do Material', 20, startY);
    
    if (options.materiais.length > 0) {
      const material = options.materiais[0];
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      
      let y = startY + 15;
      this.doc.text(`Código: ${material.codigo}`, 20, y);
      y += 8;
      this.doc.text(`Tipo: ${this.getTipoTextMaterial(material.tipo)}`, 20, y);
      y += 8;
      this.doc.text(`Nome: ${material.nome}`, 20, y);
      y += 8;
      this.doc.text(`Estado: ${material.estado}`, 20, y);
      y += 8;
      this.doc.text(`Quantidade: ${material.quantidade}`, 20, y);
      y += 8;
      this.doc.text(`Fornecedor ID: ${material.fornecedor_id}`, 20, y);
      y += 8;
      this.doc.text(`Data de Receção: ${new Date(material.data_rececao).toLocaleDateString()}`, 20, y);
      
      return y + 20;
    }
    
    return startY + 20;
  }

  private addTabelaMateriais(materiais: Material[], startY: number = 200): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Dados dos Materiais', 20, startY);
    
    // Cabeçalho da tabela
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(20, startY + 10, 170, 8, 'F');
    
    this.doc.text('Código', 22, startY + 16);
    this.doc.text('Tipo', 45, startY + 16);
    this.doc.text('Descrição', 70, startY + 16);
    this.doc.text('Estado', 95, startY + 16);
    this.doc.text('Quantidade', 120, startY + 16);
    this.doc.text('Fornecedor', 145, startY + 16);
    
    // Dados da tabela
    this.doc.setTextColor(31, 41, 55);
    this.doc.setFontSize(9);
    
    let y = startY + 25;
    materiais.forEach((material, index) => {
      if (y > 280) {
        this.doc.addPage();
        y = 20;
      }
      
      this.doc.text(material.codigo, 22, y);
      this.doc.text(this.getTipoTextMaterial(material.tipo), 45, y);
              this.doc.text(material.nome?.substring(0, 15) || '-', 70, y);
      this.doc.text(material.estado, 95, y);
      this.doc.text(material.quantidade?.toString() || '-', 120, y);
              this.doc.text(material.fornecedor_id?.substring(0, 15) || '-', 145, y);
      
      y += 6;
    });
    
    return y + 10;
  }

  // Métodos para relatórios de fornecedores
  public async generateFornecedoresExecutiveReport(fornecedores: Fornecedor[]): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Executivo de Fornecedores');
    
    const startY = 90;
    let currentY = this.addEstatisticasFornecedores(fornecedores, startY);
    currentY = this.addRelatorioExecutivoFornecedores(fornecedores, currentY);
    
    this.addFooter();
  }

  public async generateFornecedoresFilteredReport(fornecedores: Fornecedor[], filtros: any): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Filtrado de Fornecedores');
    
    const startY = 90;
    let currentY = this.addFiltrosFornecedores(filtros, startY);
    currentY = this.addRelatorioFiltradoFornecedores(fornecedores, currentY);
    
    this.addFooter();
  }

  public async generateFornecedoresComparativeReport(fornecedores: Fornecedor[]): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Comparativo de Fornecedores');
    
    const startY = 90;
    let currentY = this.addRelatorioComparativoFornecedores(fornecedores, startY);
    
    this.addFooter();
  }

  public async generateFornecedoresIndividualReport(fornecedores: Fornecedor[]): Promise<void> {
    this.initDocument();
    this.addHeader('QUALICORE - Relatório Individual de Fornecedor');
    
    const startY = 90;
    let currentY = this.addRelatorioIndividualFornecedor(fornecedores[0], startY);
    
    this.addFooter();
  }

  private addEstatisticasFornecedores(fornecedores: Fornecedor[], startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais', 20, startY);
    
    const total = fornecedores.length;
    const ativos = fornecedores.filter(f => f.estado === 'ativo').length;
    const inativos = fornecedores.filter(f => f.estado === 'inativo').length;
    const certificados = 0; // Certificações não implementadas ainda
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    this.doc.text(`Total de Fornecedores: ${total}`, 20, y);
    y += 8;
    this.doc.text(`Ativos: ${ativos} (${((ativos / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Inativos: ${inativos} (${((inativos / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Com Certificações: ${certificados} (${((certificados / total) * 100).toFixed(1)}%)`, 20, y);
    
    return y + 20;
  }

  private addRelatorioExecutivoFornecedores(fornecedores: Fornecedor[], startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Categoria', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    const porCategoria = fornecedores.reduce((acc, fornecedor) => {
      const categoria = fornecedor.categoria || 'Não especificado';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let y = startY + 15;
    Object.entries(porCategoria).forEach(([categoria, quantidade]) => {
      this.doc.text(`${categoria}: ${quantidade}`, 25, y);
      y += 8;
    });
    
    return y + 20;
  }

  private addFiltrosFornecedores(filtros: any, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        this.doc.text(`${key}: ${value}`, 25, y);
        y += 8;
      }
    });
    
    return y + 20;
  }

  private addRelatorioFiltradoFornecedores(fornecedores: Fornecedor[], startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Fornecedores Filtrados', 20, startY);
    
    return this.addTabelaFornecedores(fornecedores, startY + 15);
  }

  private addRelatorioComparativoFornecedores(fornecedores: Fornecedor[], startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    const porCategoria = fornecedores.reduce((acc, fornecedor) => {
      const categoria = fornecedor.categoria || 'Não especificado';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let y = startY + 15;
    Object.entries(porCategoria).forEach(([categoria, quantidade]) => {
      this.doc.text(`${categoria}: ${quantidade}`, 20, y);
      y += 8;
    });
    
    return y + 20;
  }

  private addRelatorioIndividualFornecedor(fornecedor: Fornecedor, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes do Fornecedor', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    this.doc.text(`Nome: ${fornecedor.nome}`, 20, y);
    y += 8;
    this.doc.text(`Categoria: ${fornecedor.categoria}`, 20, y);
    y += 8;
    this.doc.text(`Status: ${fornecedor.status}`, 20, y);
    y += 8;
    this.doc.text(`Email: ${fornecedor.email}`, 20, y);
    y += 8;
    this.doc.text(`Telefone: ${fornecedor.telefone}`, 20, y);
    y += 8;
    this.doc.text(`Endereço: ${fornecedor.endereco}`, 20, y);
    
    return y + 20;
  }

  private addTabelaFornecedores(fornecedores: Fornecedor[], startY: number = 200): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Dados dos Fornecedores', 20, startY);
    
    // Cabeçalho da tabela
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(20, startY + 10, 170, 8, 'F');
    
    this.doc.text('Nome', 22, startY + 16);
    this.doc.text('Categoria', 60, startY + 16);
    this.doc.text('Status', 100, startY + 16);
    this.doc.text('Email', 130, startY + 16);
    
    // Dados da tabela
    this.doc.setTextColor(31, 41, 55);
    this.doc.setFontSize(9);
    
    let y = startY + 25;
    fornecedores.forEach((fornecedor, index) => {
      if (y > 280) {
        this.doc.addPage();
        y = 20;
      }
      
      this.doc.text(fornecedor.nome?.substring(0, 20) || '-', 22, y);
      this.doc.text(fornecedor.categoria?.substring(0, 15) || '-', 60, y);
      this.doc.text(fornecedor.status || '-', 100, y);
      this.doc.text(fornecedor.email?.substring(0, 25) || '-', 130, y);
      
      y += 6;
    });
    
    return y + 10;
  }

  // Métodos para relatórios de armaduras
  public async generateArmadurasExecutiveReport(armaduras: Armadura[]): Promise<void> {
    try {
      console.log('🔍 Gerando relatório executivo com', armaduras.length, 'armaduras');
      
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Executivo de Armaduras');
      
      this.doc.setFontSize(20);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Relatório Executivo de Armaduras', 20, 60);
      
      this.doc.setFontSize(16);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`Total de Armaduras: ${armaduras.length}`, 20, 85);
      
      // Estatísticas básicas
      const aprovados = armaduras.filter(a => a.estado === 'aprovado').length;
      const reprovados = armaduras.filter(a => a.estado === 'reprovado').length;
      const emAnalise = armaduras.filter(a => a.estado === 'em_analise').length;
      
      this.doc.text(`Aprovados: ${aprovados}`, 20, 110);
      this.doc.text(`Reprovados: ${reprovados}`, 20, 130);
      this.doc.text(`Em Análise: ${emAnalise}`, 20, 150);
      
      // Lista das primeiras 5 armaduras
      this.doc.setFontSize(18);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Primeiras Armaduras:', 20, 180);
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(107, 114, 128);
      
      armaduras.slice(0, 5).forEach((armadura, index) => {
        const y = 200 + (index * 20);
        this.doc.text(`${armadura.codigo} - ${armadura.tipo} - ${armadura.estado}`, 25, y);
      });
      
      this.addFooter();
      this.save('relatorio-executivo-armaduras.pdf');
      console.log('✅ Relatório executivo de armaduras gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório executivo de armaduras:', error);
      throw error;
    }
  }

  public async generateArmadurasFilteredReport(armaduras: Armadura[], filtros: any): Promise<void> {
    try {
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Filtrado de Armaduras');
      
      const startY = 90;
      let currentY = this.addFiltrosArmaduras(filtros, startY);
      currentY = this.addTabelaArmaduras(armaduras, currentY);
      
      this.addFooter();
      this.save('relatorio-filtrado-armaduras.pdf');
      console.log('✅ Relatório filtrado de armaduras gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório filtrado de armaduras:', error);
      throw error;
    }
  }

  public async generateArmadurasComparativeReport(armaduras: Armadura[]): Promise<void> {
    try {
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Comparativo de Armaduras');
      
      const startY = 90;
      let currentY = this.addRelatorioComparativoArmaduras({ armaduras }, startY);
      currentY = this.addTabelaArmaduras(armaduras, currentY);
      
      this.addFooter();
      this.save('relatorio-comparativo-armaduras.pdf');
      console.log('✅ Relatório comparativo de armaduras gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório comparativo de armaduras:', error);
      throw error;
    }
  }

  public async generateArmadurasIndividualReport(armaduras: Armadura[]): Promise<void> {
    try {
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Individual de Armadura');
      
      const startY = 90;
      let currentY = this.addRelatorioIndividualArmadura({ armaduras }, startY);
      currentY = this.addTabelaArmaduras(armaduras, currentY);
      
      this.addFooter();
      this.save('relatorio-individual-armadura.pdf');
      console.log('✅ Relatório individual de armadura gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório individual de armadura:', error);
      throw error;
    }
  }

  private addEstatisticasArmaduras(armaduras: Armadura[], startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Estatísticas Gerais', 20, startY);
    
    const total = armaduras.length;
    const aprovados = armaduras.filter(a => a.estado === 'aprovado').length;
    const reprovados = armaduras.filter(a => a.estado === 'reprovado').length;
    const emAnalise = armaduras.filter(a => a.estado === 'em_analise').length;
    const pendentes = armaduras.filter(a => a.estado === 'pendente').length;
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    this.doc.text(`Total de Armaduras: ${total}`, 20, y);
    y += 8;
    this.doc.text(`Aprovados: ${aprovados} (${((aprovados / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Reprovados: ${reprovados} (${((reprovados / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Em Análise: ${emAnalise} (${((emAnalise / total) * 100).toFixed(1)}%)`, 20, y);
    y += 8;
    this.doc.text(`Pendentes: ${pendentes} (${((pendentes / total) * 100).toFixed(1)}%)`, 20, y);
    
    return y + 20;
  }

  private addRelatorioExecutivoArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise por Tipo', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    const porTipo = options.armaduras.reduce((acc, armadura) => {
      const tipo = armadura.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let y = startY + 15;
    Object.entries(porTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade}`, 25, y);
      y += 8;
    });
    
    return y + 20;
  }

  private addFiltrosArmaduras(filtros: any, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Filtros Aplicados', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    let y = startY + 15;
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        this.doc.text(`${key}: ${value}`, 25, y);
        y += 8;
      }
    });
    
    return y + 20;
  }

  private addRelatorioFiltradoArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Armaduras Filtradas', 20, startY);
    
    return this.addTabelaArmaduras(options.armaduras, startY + 15);
  }

  private addRelatorioComparativoArmaduras(options: RelatorioArmadurasOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Análise Comparativa', 20, startY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128);
    
    const porTipo = options.armaduras.reduce((acc, armadura) => {
      const tipo = armadura.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let y = startY + 15;
    Object.entries(porTipo).forEach(([tipo, quantidade]) => {
      this.doc.text(`${tipo}: ${quantidade}`, 20, y);
      y += 8;
    });
    
    return y + 20;
  }

  private addRelatorioIndividualArmadura(options: RelatorioArmadurasOptions, startY: number): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Detalhes da Armadura', 20, startY);
    
    if (options.armaduras.length > 0) {
      const armadura = options.armaduras[0];
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      
      let y = startY + 15;
      this.doc.text(`Código: ${armadura.codigo}`, 20, y);
      y += 8;
      this.doc.text(`Tipo: ${armadura.tipo}`, 20, y);
      y += 8;
      this.doc.text(`Diâmetro: ${armadura.diametro}mm`, 20, y);
      y += 8;
      this.doc.text(`Estado: ${armadura.estado}`, 20, y);
      y += 8;
      this.doc.text(`Fabricante: ${armadura.fabricante || 'Não especificado'}`, 20, y);
      y += 8;
      this.doc.text(`Peso Total: ${armadura.peso_total}kg`, 20, y);
      
      return y + 20;
    }
    
    return startY + 20;
  }

  private addTabelaArmaduras(armaduras: Armadura[], startY: number = 200): number {
    this.doc.setFontSize(16);
    this.doc.setTextColor(31, 41, 55);
    this.doc.text('Dados das Armaduras', 20, startY);
    
    // Cabeçalho da tabela - usando largura completa
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(20, startY + 10, 570, 8, 'F'); // Largura completa: 570
    
    this.doc.text('Código', 22, startY + 16);
    this.doc.text('Tipo', 80, startY + 16);
    this.doc.text('Diâmetro', 140, startY + 16);
    this.doc.text('Estado', 200, startY + 16);
    this.doc.text('Fabricante', 280, startY + 16);
    this.doc.text('Peso (kg)', 400, startY + 16);
    this.doc.text('Zona', 480, startY + 16);
    
    // Dados da tabela
    this.doc.setTextColor(31, 41, 55);
    this.doc.setFontSize(9);
    
    let y = startY + 25;
    armaduras.forEach((armadura, index) => {
      if (y > 280) {
        this.doc.addPage();
        y = 20;
      }
      
      this.doc.text(armadura.codigo, 22, y);
      this.doc.text(armadura.tipo, 80, y);
      this.doc.text(`${armadura.diametro}mm`, 140, y);
      this.doc.text(armadura.estado, 200, y);
      this.doc.text(armadura.fabricante || '-', 280, y);
      this.doc.text(armadura.peso_total?.toString() || '-', 400, y);
      this.doc.text(armadura.zona || '-', 480, y);
      
      y += 6;
    });
    
    return y + 10;
  }

  // Método para salvar o PDF
  public save(filename: string) {
    this.doc.save(filename);
  }

  // Método de teste para verificar se o PDF funciona
  public async testPDFGeneration(): Promise<void> {
    try {
      console.log('🔍 Testando PDF generation...');
      
      this.initDocument();
      this.addHeader('Teste PDF - Qualicore');
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Este é um teste de geração de PDF', 20, 60);
      this.doc.text('Se vires este PDF, a geração está a funcionar!', 20, 80);
      
      this.addFooter();
      this.save('teste-qualicore.pdf');
      
      console.log('✅ PDF de teste gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar PDF de teste:', error);
      throw error;
    }
  }

  // Método de teste simples para armaduras
  public async testArmadurasPDF(armaduras: Armadura[]): Promise<void> {
    try {
      console.log('🔍 Testando PDF de armaduras com', armaduras.length, 'armaduras');
      
      this.initDocument();
      this.addHeader('Teste PDF Armaduras - Qualicore');
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text(`Total de armaduras: ${armaduras.length}`, 20, 60);
      
      if (armaduras.length > 0) {
        this.doc.text(`Primeira armadura: ${armaduras[0].codigo}`, 20, 80);
        this.doc.text(`Tipo: ${armaduras[0].tipo}`, 20, 100);
        this.doc.text(`Estado: ${armaduras[0].estado}`, 20, 120);
      }
      
      this.addFooter();
      this.save('teste-armaduras-qualicore.pdf');
      
      console.log('✅ PDF de teste de armaduras gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar PDF de teste de armaduras:', error);
      throw error;
    }
  }

  // Métodos para relatórios de solos
  public async generateSolosExecutiveReport(solos: any[]): Promise<void> {
    try {
      console.log('🔍 Gerando relatório executivo de solos com', solos.length, 'solos');
      
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Executivo de Solos');
      
      this.doc.setFontSize(16);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Relatório Executivo de Solos', 20, 60);
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`Total de Solos: ${solos.length}`, 20, 80);
      
      // Estatísticas básicas
      const aprovados = solos.filter(s => s.estado === 'aprovado').length;
      const reprovados = solos.filter(s => s.estado === 'reprovado').length;
      const emAnalise = solos.filter(s => s.estado === 'em_analise').length;
      
      this.doc.text(`Aprovados: ${aprovados}`, 20, 100);
      this.doc.text(`Reprovados: ${reprovados}`, 20, 115);
      this.doc.text(`Em Análise: ${emAnalise}`, 20, 130);
      
      // Lista dos primeiros 5 solos
      this.doc.setFontSize(14);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Primeiros Solos:', 20, 160);
      
      this.doc.setFontSize(10);
      this.doc.setTextColor(107, 114, 128);
      
      solos.slice(0, 5).forEach((solo, index) => {
        const y = 175 + (index * 12);
        this.doc.text(`${solo.codigo || solo.id} - ${solo.tipo || 'N/A'} - ${solo.estado || 'N/A'}`, 25, y);
      });
      
      this.addFooter();
      this.save('relatorio-executivo-solos.pdf');
      console.log('✅ Relatório executivo de solos gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório executivo de solos:', error);
      throw error;
    }
  }

  public async generateSolosFilteredReport(solos: any[], filtros: any): Promise<void> {
    try {
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Filtrado de Solos');
      
      this.doc.setFontSize(16);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Relatório Filtrado de Solos', 20, 60);
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`Total de Solos Filtrados: ${solos.length}`, 20, 80);
      
      this.addFooter();
      this.save('relatorio-filtrado-solos.pdf');
      console.log('✅ Relatório filtrado de solos gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório filtrado de solos:', error);
      throw error;
    }
  }

  public async generateSolosComparativeReport(solos: any[]): Promise<void> {
    try {
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Comparativo de Solos');
      
      this.doc.setFontSize(16);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Relatório Comparativo de Solos', 20, 60);
      
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`Total de Solos: ${solos.length}`, 20, 80);
      
      this.addFooter();
      this.save('relatorio-comparativo-solos.pdf');
      console.log('✅ Relatório comparativo de solos gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório comparativo de solos:', error);
      throw error;
    }
  }

  public async generateSolosIndividualReport(solos: any[]): Promise<void> {
    try {
      this.initDocument();
      this.addHeader('QUALICORE - Relatório Individual de Solo');
      
      this.doc.setFontSize(16);
      this.doc.setTextColor(31, 41, 55);
      this.doc.text('Relatório Individual de Solo', 20, 60);
      
      if (solos.length > 0) {
        const solo = solos[0];
        this.doc.setFontSize(12);
        this.doc.setTextColor(107, 114, 128);
        this.doc.text(`Código: ${solo.codigo || solo.id}`, 20, 80);
        this.doc.text(`Tipo: ${solo.tipo || 'N/A'}`, 20, 95);
        this.doc.text(`Estado: ${solo.estado || 'N/A'}`, 20, 110);
      }
      
      this.addFooter();
      this.save('relatorio-individual-solo.pdf');
      console.log('✅ Relatório individual de solo gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório individual de solo:', error);
      throw error;
    }
  }
}
