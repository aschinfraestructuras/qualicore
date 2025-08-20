import { PDFConfig } from './pdfService';

class PDFConfigService {
  private static instance: PDFConfigService;
  private config: PDFConfig;
  private readonly STORAGE_KEY = 'qualicore_pdf_config';

  private constructor() {
    this.config = this.loadFromStorage();
  }

  public static getInstance(): PDFConfigService {
    if (!PDFConfigService.instance) {
      PDFConfigService.instance = new PDFConfigService();
    }
    return PDFConfigService.instance;
  }

  private loadFromStorage(): PDFConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.log('Erro ao carregar configuração do PDF:', error);
    }

    // Configuração padrão
    return {
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
        corPrimaria: '#3B82F6',
        corSecundaria: '#1E40AF',
        corTexto: '#1F2937',
        corFundo: '#F8FAFC',
        fonteTitulo: 'helvetica',
        fonteTexto: 'helvetica'
      }
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.log('Erro ao guardar configuração do PDF:', error);
    }
  }

  public getConfig(): PDFConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<PDFConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveToStorage();
  }

  public setEmpresa(empresa: Partial<PDFConfig['empresa']>): void {
    this.config.empresa = { ...this.config.empresa, ...empresa };
    this.saveToStorage();
  }

  public setObra(obra: PDFConfig['obra']): void {
    this.config.obra = obra;
    this.saveToStorage();
  }

  public setLogotipo(logotipoUrl: string): void {
    this.config.empresa.logotipo = logotipoUrl;
    this.saveToStorage();
  }

  public setDesign(design: Partial<PDFConfig['design']>): void {
    this.config.design = { ...this.config.design, ...design };
    this.saveToStorage();
  }

  public resetToDefault(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.config = this.loadFromStorage();
  }

  public getDefaultConfig(): PDFConfig {
    return this.loadFromStorage();
  }
}

export default PDFConfigService;
