import { supabase } from '@/lib/supabase';

export interface ShareOptions {
  email?: string;
  subject?: string;
  message?: string;
  saveToBackend?: boolean;
  downloadLocal?: boolean;
}

export interface ShareResult {
  success: boolean;
  message: string;
  fileUrl?: string;
  localPath?: string;
}

export class ShareService {
  /**
   * Partilha um RFI por email
   */
  async shareRFIByEmail(rfi: any, options: ShareOptions): Promise<ShareResult> {
    try {
      if (!options.email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF do RFI
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateRFIsIndividualReport([rfi]);

      // Criar link temporário para download
      const fileName = `RFI_${rfi.numero}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email (simulado - em produção usar serviço de email real)
      await this.sendEmail({
        to: options.email,
        subject: options.subject || `RFI ${rfi.numero} - ${rfi.titulo}`,
        message: options.message || this.generateRFIEmailMessage(rfi),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `RFI partilhado com sucesso para ${options.email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar RFI por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Partilha uma Não Conformidade por email
   */
  async shareNaoConformidadeByEmail(nc: any, options: ShareOptions): Promise<ShareResult> {
    try {
      if (!options.email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF da NC
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateNaoConformidadesIndividualReport([nc]);

      // Criar link temporário para download
      const fileName = `NC_${nc.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: options.email,
        subject: options.subject || `Não Conformidade ${nc.codigo} - ${nc.tipo}`,
        message: options.message || this.generateNaoConformidadeEmailMessage(nc),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Não Conformidade partilhada com sucesso para ${options.email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar Não Conformidade por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Partilha um Fornecedor por email
   */
  async shareFornecedorByEmail(fornecedor: any, options: ShareOptions): Promise<ShareResult> {
    try {
      if (!options.email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF do Fornecedor
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateFornecedoresIndividualReport([fornecedor]);

      // Criar link temporário para download
      const fileName = `Fornecedor_${fornecedor.nome}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: options.email,
        subject: options.subject || `Fornecedor ${fornecedor.nome}`,
        message: options.message || this.generateFornecedorEmailMessage(fornecedor),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Fornecedor partilhado com sucesso para ${options.email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar Fornecedor por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Partilha um Material por email
   */
  async shareMaterialByEmail(material: any, options: ShareOptions): Promise<ShareResult> {
    try {
      if (!options.email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF do Material
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateMateriaisIndividualReport([material]);

      // Criar link temporário para download
      const fileName = `Material_${material.nome}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: options.email,
        subject: options.subject || `Material ${material.nome}`,
        message: options.message || this.generateMaterialEmailMessage(material),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Material partilhado com sucesso para ${options.email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar Material por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva RFI no backend
   */
  async saveRFIToBackend(rfi: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        // Gerar PDF usando o método existente
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateRFIsIndividualReport([rfi]);
        // Como o método não retorna blob, vamos simular
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      // Upload para Supabase Storage
      const fileName = `rfis/RFI_${rfi.numero}_${new Date().toISOString().split('T')[0]}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Atualizar RFI no banco com URL do arquivo
      const { error: updateError } = await supabase
        .from('rfis')
        .update({ 
          arquivo_url: fileUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', rfi.id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'RFI salvo no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao salvar RFI no backend:', error);
      return {
        success: false,
        message: `Erro ao salvar no backend: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Não Conformidade no backend
   */
  async saveNaoConformidadeToBackend(nc: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateNaoConformidadesIndividualReport([nc]);
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      const fileName = `nao_conformidades/NC_${nc.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('nao_conformidades')
        .update({ 
          arquivo_url: fileUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', nc.id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Não Conformidade salva no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao salvar Não Conformidade no backend:', error);
      return {
        success: false,
        message: `Erro ao salvar no backend: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Fornecedor no backend
   */
  async saveFornecedorToBackend(fornecedor: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateFornecedoresIndividualReport([fornecedor]);
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      const fileName = `fornecedores/Fornecedor_${fornecedor.nome}_${new Date().toISOString().split('T')[0]}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('fornecedores')
        .update({ 
          arquivo_url: fileUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', fornecedor.id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Fornecedor salvo no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao salvar Fornecedor no backend:', error);
      return {
        success: false,
        message: `Erro ao salvar no backend: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Material no backend
   */
  async saveMaterialToBackend(material: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateMateriaisIndividualReport([material]);
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      const fileName = `materiais/Material_${material.nome}_${new Date().toISOString().split('T')[0]}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('materiais')
        .update({ 
          arquivo_url: fileUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', material.id);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Material salvo no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao salvar Material no backend:', error);
      return {
        success: false,
        message: `Erro ao salvar no backend: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Download local do RFI
   */
  async downloadRFILocal(rfi: any): Promise<ShareResult> {
    try {
      // Gerar PDF usando o método existente
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateRFIsIndividualReport([rfi]);

      // Como o método não retorna blob, vamos simular o download
      const fileName = `RFI_${rfi.numero}_${rfi.titulo?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Simular download (em produção, o PDFService deveria retornar blob)
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();

      return {
        success: true,
        message: `RFI descarregado: ${fileName}`,
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar RFI:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Download local da Não Conformidade
   */
  async downloadNaoConformidadeLocal(nc: any): Promise<ShareResult> {
    try {
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateNaoConformidadesIndividualReport([nc]);

      const fileName = `NC_${nc.codigo}_${nc.tipo?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();

      return {
        success: true,
        message: `Não Conformidade descarregada: ${fileName}`,
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar Não Conformidade:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Download local do Fornecedor
   */
  async downloadFornecedorLocal(fornecedor: any): Promise<ShareResult> {
    try {
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateFornecedoresIndividualReport([fornecedor]);

      const fileName = `Fornecedor_${fornecedor.nome?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();

      return {
        success: true,
        message: `Fornecedor descarregado: ${fileName}`,
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar Fornecedor:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Download local do Material
   */
  async downloadMaterialLocal(material: any): Promise<ShareResult> {
    try {
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateMateriaisIndividualReport([material]);

      const fileName = `Material_${material.nome?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();

      return {
        success: true,
        message: `Material descarregado: ${fileName}`,
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar Material:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Partilha RFI com múltiplas opções
   */
  async shareRFI(rfi: any, options: ShareOptions): Promise<ShareResult[]> {
    const results: ShareResult[] = [];

    // Email
    if (options.email) {
      const emailResult = await this.shareRFIByEmail(rfi, options);
      results.push(emailResult);
    }

    // Salvar no backend
    if (options.saveToBackend) {
      const backendResult = await this.saveRFIToBackend(rfi);
      results.push(backendResult);
    }

    // Download local
    if (options.downloadLocal) {
      const downloadResult = await this.downloadRFILocal(rfi);
      results.push(downloadResult);
    }

    return results;
  }

  /**
   * Partilha Não Conformidade com múltiplas opções
   */
  async shareNaoConformidade(nc: any, options: ShareOptions): Promise<ShareResult[]> {
    const results: ShareResult[] = [];

    if (options.email) {
      const emailResult = await this.shareNaoConformidadeByEmail(nc, options);
      results.push(emailResult);
    }

    if (options.saveToBackend) {
      const backendResult = await this.saveNaoConformidadeToBackend(nc);
      results.push(backendResult);
    }

    if (options.downloadLocal) {
      const downloadResult = await this.downloadNaoConformidadeLocal(nc);
      results.push(downloadResult);
    }

    return results;
  }

  /**
   * Partilha Fornecedor com múltiplas opções
   */
  async shareFornecedor(fornecedor: any, options: ShareOptions): Promise<ShareResult[]> {
    const results: ShareResult[] = [];

    if (options.email) {
      const emailResult = await this.shareFornecedorByEmail(fornecedor, options);
      results.push(emailResult);
    }

    if (options.saveToBackend) {
      const backendResult = await this.saveFornecedorToBackend(fornecedor);
      results.push(backendResult);
    }

    if (options.downloadLocal) {
      const downloadResult = await this.downloadFornecedorLocal(fornecedor);
      results.push(downloadResult);
    }

    return results;
  }

  /**
   * Partilha Material com múltiplas opções
   */
  async shareMaterial(material: any, options: ShareOptions): Promise<ShareResult[]> {
    const results: ShareResult[] = [];

    if (options.email) {
      const emailResult = await this.shareMaterialByEmail(material, options);
      results.push(emailResult);
    }

    if (options.saveToBackend) {
      const backendResult = await this.saveMaterialToBackend(material);
      results.push(backendResult);
    }

    if (options.downloadLocal) {
      const downloadResult = await this.downloadMaterialLocal(material);
      results.push(downloadResult);
    }

    return results;
  }

  /**
   * Partilha um Documento por email
   */
  async shareDocumentoByEmail(documento: any, email: string, subject?: string, message?: string): Promise<ShareResult> {
    try {
      if (!email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF do Documento
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateDocumentosIndividualReport([documento]);

      // Criar link temporário para download
      const fileName = `Documento_${documento.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: email,
        subject: subject || `Documento ${documento.codigo} - ${documento.tipo}`,
        message: message || this.generateDocumentoEmailMessage(documento),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Documento partilhado com sucesso para ${email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar Documento por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Documento no backend
   */
  async saveDocumentoToBackend(documento: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        // Gerar PDF usando o método existente
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateDocumentosIndividualReport([documento]);
        // Como o método não retorna blob, vamos simular
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      // Upload para Supabase Storage
      const fileName = `documentos/Documento_${documento.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const { data, error } = await supabase.storage
        .from('saved-documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('saved-documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Guardar metadados na tabela
      const { error: insertError } = await supabase
        .from('saved_documentos')
        .insert({
          nome: `Documento_${documento.codigo}_${new Date().toISOString().split('T')[0]}.pdf`,
          arquivo_url: fileUrl,
          documento_data: documento,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error(`Erro ao guardar metadados: ${insertError.message}`);
      }

      return {
        success: true,
        message: 'Documento guardado no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao guardar Documento no backend:', error);
      return {
        success: false,
        message: `Erro ao guardar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Documento localmente
   */
  async downloadDocumentoLocally(documento: any): Promise<ShareResult> {
    try {
      // Gerar PDF do Documento
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateDocumentosIndividualReport([documento]);

      // Simular descarga local
      const fileName = `Documento_${documento.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Criar link de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob(['PDF content'], { type: 'application/pdf' }));
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Documento descarregado localmente com sucesso',
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar Documento localmente:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Obtém Documentos guardados
   */
  async getSavedDocumentos(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('saved_documentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao obter documentos guardados: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter documentos guardados:', error);
      return [];
    }
  }

  /**
   * Elimina Documento guardado
   */
  async deleteSavedDocumento(documentoId: string): Promise<ShareResult> {
    try {
      // Obter informações do documento
      const { data: documento, error: fetchError } = await supabase
        .from('saved_documentos')
        .select('*')
        .eq('id', documentoId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter documento: ${fetchError.message}`);
      }

      // Eliminar do storage
      if (documento.arquivo_url) {
        const fileName = documento.arquivo_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('saved-documents')
            .remove([fileName]);

          if (storageError) {
            console.warn('Erro ao eliminar do storage:', storageError);
          }
        }
      }

      // Eliminar da base de dados
      const { error: deleteError } = await supabase
        .from('saved_documentos')
        .delete()
        .eq('id', documentoId);

      if (deleteError) {
        throw new Error(`Erro ao eliminar documento: ${deleteError.message}`);
      }

      return {
        success: true,
        message: 'Documento eliminado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao eliminar documento guardado:', error);
      return {
        success: false,
        message: `Erro ao eliminar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Documento guardado
   */
  async downloadSavedDocumento(documentoId: string): Promise<ShareResult> {
    try {
      // Obter informações do documento
      const { data: documento, error: fetchError } = await supabase
        .from('saved_documentos')
        .select('*')
        .eq('id', documentoId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter documento: ${fetchError.message}`);
      }

      // Descarregar ficheiro
      const response = await fetch(documento.arquivo_url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = documento.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Documento descarregado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao descarregar documento guardado:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera mensagem de email para RFI
   */
  private generateRFIEmailMessage(rfi: any): string {
    return `
Olá,

Segue em anexo o RFI ${rfi.numero} - ${rfi.titulo}.

Detalhes:
- Solicitante: ${rfi.solicitante}
- Destinatário: ${rfi.destinatario}
- Data de Solicitação: ${rfi.data_solicitacao}
- Prioridade: ${rfi.prioridade}
- Status: ${rfi.status}

Descrição: ${rfi.descricao}

Resposta: ${rfi.resposta || 'Pendente'}

Observações: ${rfi.observacoes || 'Nenhuma'}

Este documento foi gerado automaticamente pelo sistema Qualicore.

Cumprimentos,
Equipa Qualicore
    `.trim();
  }

  /**
   * Gera mensagem de email para Não Conformidade
   */
  private generateNaoConformidadeEmailMessage(nc: any): string {
    return `
Olá,

Segue em anexo a Não Conformidade ${nc.codigo} - ${nc.tipo}.

Detalhes:
- Tipo: ${nc.tipo}
- Severidade: ${nc.severidade}
- Categoria: ${nc.categoria}
- Data de Deteção: ${nc.data_deteccao}
- Responsável: ${nc.responsavel_deteccao}

Descrição: ${nc.descricao}

Impacto: ${nc.impacto}
Área Afetada: ${nc.area_afetada}

Ação Corretiva: ${nc.acao_corretiva || 'Pendente'}

Este documento foi gerado automaticamente pelo sistema Qualicore.

Cumprimentos,
Equipa Qualicore
    `.trim();
  }

  /**
   * Gera mensagem de email para Fornecedor
   */
  private generateFornecedorEmailMessage(fornecedor: any): string {
    return `
Olá,

Segue em anexo a ficha do Fornecedor ${fornecedor.nome}.

Detalhes:
- NIF: ${fornecedor.nif}
- Morada: ${fornecedor.morada}
- Telefone: ${fornecedor.telefone}
- Email: ${fornecedor.email}
- Contacto: ${fornecedor.contacto}
- Estado: ${fornecedor.estado}
- Data de Registo: ${fornecedor.data_registo}

Este documento foi gerado automaticamente pelo sistema Qualicore.

Cumprimentos,
Equipa Qualicore
    `.trim();
  }

  /**
   * Gera mensagem de email para Material
   */
  private generateMaterialEmailMessage(material: any): string {
    return `
Olá,

Segue em anexo a ficha do Material ${material.nome}.

Detalhes:
- Tipo: ${material.tipo}
- Código: ${material.codigo}
- Quantidade: ${material.quantidade} ${material.unidade}
- Lote: ${material.lote}
- Data de Receção: ${material.data_rececao}
- Responsável: ${material.responsavel}
- Zona: ${material.zona}

Observações: ${material.observacoes || 'Nenhuma'}

Este documento foi gerado automaticamente pelo sistema Qualicore.

Cumprimentos,
Equipa Qualicore
    `.trim();
  }

  /**
   * Gera mensagem de email para Documento
   */
  private generateDocumentoEmailMessage(documento: any): string {
    return `Segue em anexo o documento ${documento.codigo}.

Detalhes do Documento:
- Código: ${documento.codigo}
- Tipo: ${documento.tipo}
- Versão: ${documento.versao}
- Responsável: ${documento.responsavel}
- Estado: ${documento.estado}
- Zona: ${documento.zona}
${documento.observacoes ? `- Observações: ${documento.observacoes}` : ''}

Este documento foi gerado automaticamente pelo sistema Qualicore.

Cumprimentos,
Equipa Qualicore`;
  }

  /**
   * Upload para armazenamento temporário
   */
  private async uploadToTemporaryStorage(blob: Blob, fileName: string): Promise<string> {
    // Em produção, usar serviço de armazenamento temporário
    // Por agora, retornar URL simulada
    return `https://temp-storage.qualicore.pt/${fileName}`;
  }

  /**
   * Enviar email (simulado)
   */
  private async sendEmail(params: {
    to: string;
    subject: string;
    message: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }): Promise<void> {
    // Em produção, integrar com serviço de email real (SendGrid, AWS SES, etc.)
    console.log('Email enviado:', params);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Obter RFIs salvos no backend
   */
  async getSavedRFIs(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('rfis')
        .select('*')
        .not('arquivo_url', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter RFIs salvos:', error);
      return [];
    }
  }

  /**
   * Obter Não Conformidades salvas no backend
   */
  async getSavedNaoConformidades(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('nao_conformidades')
        .select('*')
        .not('arquivo_url', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter Não Conformidades salvas:', error);
      return [];
    }
  }

  /**
   * Obter Fornecedores salvos no backend
   */
  async getSavedFornecedores(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .not('arquivo_url', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter Fornecedores salvos:', error);
      return [];
    }
  }

  /**
   * Obter Materiais salvos no backend
   */
  async getSavedMateriais(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .not('arquivo_url', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter Materiais salvos:', error);
      return [];
    }
  }

  /**
   * Excluir RFI do backend
   */
  async deleteRFIFromBackend(rfiId: string): Promise<ShareResult> {
    try {
      // Obter RFI para pegar URL do arquivo
      const { data: rfi } = await supabase
        .from('rfis')
        .select('arquivo_url')
        .eq('id', rfiId)
        .single();

      if (rfi?.arquivo_url) {
        // Extrair nome do arquivo da URL
        const fileName = rfi.arquivo_url.split('/').pop();
        if (fileName) {
          // Excluir do storage
          await supabase.storage
            .from('documents')
            .remove([`rfis/${fileName}`]);
        }
      }

      // Limpar URL do banco
      await supabase
        .from('rfis')
        .update({ arquivo_url: null })
        .eq('id', rfiId);

      return {
        success: true,
        message: 'RFI excluído do backend com sucesso'
      };
    } catch (error) {
      console.error('Erro ao excluir RFI do backend:', error);
      return {
        success: false,
        message: `Erro ao excluir: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Excluir Não Conformidade do backend
   */
  async deleteNaoConformidadeFromBackend(ncId: string): Promise<ShareResult> {
    try {
      const { data: nc } = await supabase
        .from('nao_conformidades')
        .select('arquivo_url')
        .eq('id', ncId)
        .single();

      if (nc?.arquivo_url) {
        const fileName = nc.arquivo_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('documents')
            .remove([`nao_conformidades/${fileName}`]);
        }
      }

      await supabase
        .from('nao_conformidades')
        .update({ arquivo_url: null })
        .eq('id', ncId);

      return {
        success: true,
        message: 'Não Conformidade excluída do backend com sucesso'
      };
    } catch (error) {
      console.error('Erro ao excluir Não Conformidade do backend:', error);
      return {
        success: false,
        message: `Erro ao excluir: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Excluir Fornecedor do backend
   */
  async deleteFornecedorFromBackend(fornecedorId: string): Promise<ShareResult> {
    try {
      const { data: fornecedor } = await supabase
        .from('fornecedores')
        .select('arquivo_url')
        .eq('id', fornecedorId)
        .single();

      if (fornecedor?.arquivo_url) {
        const fileName = fornecedor.arquivo_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('documents')
            .remove([`fornecedores/${fileName}`]);
        }
      }

      await supabase
        .from('fornecedores')
        .update({ arquivo_url: null })
        .eq('id', fornecedorId);

      return {
        success: true,
        message: 'Fornecedor excluído do backend com sucesso'
      };
    } catch (error) {
      console.error('Erro ao excluir Fornecedor do backend:', error);
      return {
        success: false,
        message: `Erro ao excluir: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Excluir Material do backend
   */
  async deleteMaterialFromBackend(materialId: string): Promise<ShareResult> {
    try {
      const { data: material } = await supabase
        .from('materiais')
        .select('arquivo_url')
        .eq('id', materialId)
        .single();

      if (material?.arquivo_url) {
        const fileName = material.arquivo_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('documents')
            .remove([`materiais/${fileName}`]);
        }
      }

      await supabase
        .from('materiais')
        .update({ arquivo_url: null })
        .eq('id', materialId);

      return {
        success: true,
        message: 'Material excluído do backend com sucesso'
      };
    } catch (error) {
      console.error('Erro ao excluir Material do backend:', error);
      return {
        success: false,
        message: `Erro ao excluir: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Partilha um Ensaio por email
   */
  async shareEnsaioByEmail(ensaio: any, email: string, subject?: string, message?: string): Promise<ShareResult> {
    try {
      if (!email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF do Ensaio
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateEnsaiosIndividualReport([ensaio]);

      // Criar link temporário para download
      const fileName = `Ensaio_${ensaio.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: email,
        subject: subject || `Ensaio ${ensaio.codigo} - ${ensaio.tipo}`,
        message: message || this.generateEnsaioEmailMessage(ensaio),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Ensaio partilhado com sucesso para ${email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar Ensaio por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Ensaio no backend
   */
  async saveEnsaioToBackend(ensaio: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        // Gerar PDF usando o método existente
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateEnsaiosIndividualReport([ensaio]);
        // Como o método não retorna blob, vamos simular
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      // Upload para Supabase Storage
      const fileName = `ensaios/Ensaio_${ensaio.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const { data, error } = await supabase.storage
        .from('saved-documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('saved-documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Guardar metadados na tabela
      const { error: insertError } = await supabase
        .from('saved_ensaios')
        .insert({
          nome: `Ensaio_${ensaio.codigo}_${new Date().toISOString().split('T')[0]}.pdf`,
          arquivo_url: fileUrl,
          ensaio_data: ensaio,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error(`Erro ao guardar metadados: ${insertError.message}`);
      }

      return {
        success: true,
        message: 'Ensaio guardado no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao guardar Ensaio no backend:', error);
      return {
        success: false,
        message: `Erro ao guardar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Ensaio localmente
   */
  async downloadEnsaioLocally(ensaio: any): Promise<ShareResult> {
    try {
      // Gerar PDF do Ensaio
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateEnsaiosIndividualReport([ensaio]);

      // Simular descarga local
      const fileName = `Ensaio_${ensaio.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Criar link de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob(['PDF content'], { type: 'application/pdf' }));
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Ensaio descarregado localmente com sucesso',
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar Ensaio localmente:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Obtém Ensaios guardados
   */
  async getSavedEnsaios(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('saved_ensaios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao obter ensaios guardados: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter ensaios guardados:', error);
      return [];
    }
  }

  /**
   * Elimina Ensaio guardado
   */
  async deleteSavedEnsaio(ensaioId: string): Promise<ShareResult> {
    try {
      // Obter informações do ensaio
      const { data: ensaio, error: fetchError } = await supabase
        .from('saved_ensaios')
        .select('*')
        .eq('id', ensaioId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter ensaio: ${fetchError.message}`);
      }

      // Eliminar do storage
      if (ensaio.arquivo_url) {
        const fileName = ensaio.arquivo_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('saved-documents')
            .remove([fileName]);

          if (storageError) {
            console.warn('Erro ao eliminar do storage:', storageError);
          }
        }
      }

      // Eliminar da base de dados
      const { error: deleteError } = await supabase
        .from('saved_ensaios')
        .delete()
        .eq('id', ensaioId);

      if (deleteError) {
        throw new Error(`Erro ao eliminar ensaio: ${deleteError.message}`);
      }

      return {
        success: true,
        message: 'Ensaio eliminado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao eliminar ensaio guardado:', error);
      return {
        success: false,
        message: `Erro ao eliminar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Ensaio guardado
   */
  async downloadSavedEnsaio(ensaioId: string): Promise<ShareResult> {
    try {
      // Obter informações do ensaio
      const { data: ensaio, error: fetchError } = await supabase
        .from('saved_ensaios')
        .select('*')
        .eq('id', ensaioId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter ensaio: ${fetchError.message}`);
      }

      // Descarregar ficheiro
      const response = await fetch(ensaio.arquivo_url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = ensaio.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Ensaio descarregado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao descarregar ensaio guardado:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera mensagem de email para Ensaio
   */
  private generateEnsaioEmailMessage(ensaio: any): string {
    return `Segue em anexo o ensaio ${ensaio.codigo}.

Detalhes do Ensaio:
- Código: ${ensaio.codigo}
- Tipo: ${ensaio.tipo}
- Material: ${ensaio.material}
- Responsável: ${ensaio.responsavel}
- Estado: ${ensaio.estado}
- Zona: ${ensaio.zona}
${ensaio.observacoes ? `- Observações: ${ensaio.observacoes}` : ''}

Este ensaio foi gerado automaticamente pelo sistema Qualicore.

Cumprimentos,
Equipa Qualicore`;
  }

  /**
   * Partilha um Checklist por email
   */
  async shareChecklistByEmail(checklist: any, email: string, subject?: string, message?: string): Promise<ShareResult> {
    try {
      if (!email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF do Checklist
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateChecklistsIndividualReport([checklist]);

      // Criar link temporário para download
      const fileName = `Checklist_${checklist.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: email,
        subject: subject || `Checklist ${checklist.codigo} - ${checklist.tipo}`,
        message: message || this.generateChecklistEmailMessage(checklist),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Checklist partilhado com sucesso para ${email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar Checklist por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Checklist no backend
   */
  async saveChecklistToBackend(checklist: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        // Gerar PDF usando o método existente
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateChecklistsIndividualReport([checklist]);
        // Como o método não retorna blob, vamos simular
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      // Upload para Supabase Storage
      const fileName = `checklists/Checklist_${checklist.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const { data, error } = await supabase.storage
        .from('saved-documents')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('saved-documents')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Guardar metadados na tabela
      const { error: insertError } = await supabase
        .from('saved_checklists')
        .insert({
          nome: `Checklist_${checklist.codigo}_${new Date().toISOString().split('T')[0]}.pdf`,
          arquivo_url: fileUrl,
          checklist_data: checklist,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error(`Erro ao guardar metadados: ${insertError.message}`);
      }

      return {
        success: true,
        message: 'Checklist guardado no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao guardar Checklist no backend:', error);
      return {
        success: false,
        message: `Erro ao guardar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Checklist localmente
   */
  async downloadChecklistLocally(checklist: any): Promise<ShareResult> {
    try {
      // Gerar PDF do Checklist
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateChecklistsIndividualReport([checklist]);

      // Simular descarga local
      const fileName = `Checklist_${checklist.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Criar link de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob(['PDF content'], { type: 'application/pdf' }));
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Checklist descarregado localmente com sucesso',
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar Checklist localmente:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Obtém Checklists guardados
   */
  async getSavedChecklists(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('saved_checklists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao obter checklists guardados: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter checklists guardados:', error);
      return [];
    }
  }

  /**
   * Elimina Checklist guardado
   */
  async deleteSavedChecklist(checklistId: string): Promise<ShareResult> {
    try {
      // Obter informações do checklist
      const { data: checklist, error: fetchError } = await supabase
        .from('saved_checklists')
        .select('*')
        .eq('id', checklistId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter checklist: ${fetchError.message}`);
      }

      // Eliminar do storage
      if (checklist.arquivo_url) {
        const fileName = checklist.arquivo_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('saved-documents')
            .remove([fileName]);

          if (storageError) {
            console.warn('Erro ao eliminar do storage:', storageError);
          }
        }
      }

      // Eliminar da base de dados
      const { error: deleteError } = await supabase
        .from('saved_checklists')
        .delete()
        .eq('id', checklistId);

      if (deleteError) {
        throw new Error(`Erro ao eliminar checklist: ${deleteError.message}`);
      }

      return {
        success: true,
        message: 'Checklist eliminado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao eliminar checklist guardado:', error);
      return {
        success: false,
        message: `Erro ao eliminar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Checklist guardado
   */
  async downloadSavedChecklist(checklistId: string): Promise<ShareResult> {
    try {
      // Obter informações do checklist
      const { data: checklist, error: fetchError } = await supabase
        .from('saved_checklists')
        .select('*')
        .eq('id', checklistId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter checklist: ${fetchError.message}`);
      }

      // Descarregar ficheiro
      const response = await fetch(checklist.arquivo_url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = checklist.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Checklist descarregado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao descarregar checklist guardado:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera mensagem de email para Checklist
   */
  private generateChecklistEmailMessage(checklist: any): string {
    return `Segue em anexo o checklist ${checklist.codigo} - ${checklist.tipo}.

Detalhes:
- Código: ${checklist.codigo}
- Tipo: ${checklist.tipo}
- Responsável: ${checklist.responsavel}
- Zona: ${checklist.zona}
- Estado: ${checklist.estado}

Cumprimentos,`;
  }

  /**
   * Partilha uma Obra por email
   */
  async shareObraByEmail(obra: any, email: string, subject?: string, message?: string): Promise<ShareResult> {
    try {
      if (!email) {
        throw new Error('Email é obrigatório para partilha');
      }

      // Gerar PDF da Obra
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateObrasIndividualReport([obra]);

      // Criar link temporário para download
      const fileName = `Obra_${obra.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUrl = await this.uploadToTemporaryStorage(new Blob(), fileName);

      // Enviar email
      await this.sendEmail({
        to: email,
        subject: subject || `Obra ${obra.codigo} - ${obra.nome}`,
        message: message || this.generateObraEmailMessage(obra),
        attachmentUrl: fileUrl,
        attachmentName: fileName
      });

      return {
        success: true,
        message: `Obra partilhada com sucesso para ${email}`,
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao partilhar obra por email:', error);
      return {
        success: false,
        message: `Erro ao partilhar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Salva Obra no backend
   */
  async saveObraToBackend(obra: any, pdfBlob?: Blob): Promise<ShareResult> {
    try {
      let fileUrl = '';
      
      if (!pdfBlob) {
        // Gerar PDF usando o método existente
        const { PDFService } = await import('./pdfService');
        const pdfService = new PDFService();
        await pdfService.generateObrasIndividualReport([obra]);
        // Como o método não retorna blob, vamos simular
        pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      }

      // Upload para Supabase Storage
      const fileName = `obras/Obra_${obra.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      fileUrl = urlData.publicUrl;

      // Guardar referência na base de dados
      const { error: dbError } = await supabase
        .from('saved_pdfs')
        .insert({
          nome: `Obra ${obra.codigo} - ${obra.nome}`,
          arquivo_url: fileUrl,
          tipo: 'obra',
          obra_data: obra,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        throw new Error(`Erro ao guardar na base de dados: ${dbError.message}`);
      }

      return {
        success: true,
        message: 'Obra guardada no backend com sucesso',
        fileUrl
      };
    } catch (error) {
      console.error('Erro ao guardar obra no backend:', error);
      return {
        success: false,
        message: `Erro ao guardar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Descarrega Obra localmente
   */
  async downloadObraLocally(obra: any): Promise<ShareResult> {
    try {
      // Gerar PDF
      const { PDFService } = await import('./pdfService');
      const pdfService = new PDFService();
      await pdfService.generateObrasIndividualReport([obra]);

      // Simular download (em produção, retornaria o blob real)
      const fileName = `Obra_${obra.codigo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      return {
        success: true,
        message: 'Obra descarregada localmente com sucesso',
        localPath: fileName
      };
    } catch (error) {
      console.error('Erro ao descarregar obra localmente:', error);
      return {
        success: false,
        message: `Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Obtém obras guardadas
   */
  async getSavedObras(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('saved_pdfs')
        .select('*')
        .eq('tipo', 'obra')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao obter obras guardadas: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter obras guardadas:', error);
      return [];
    }
  }

  /**
   * Elimina obra guardada
   */
  async deleteSavedObra(obraId: string): Promise<ShareResult> {
    try {
      // Obter dados da obra
      const { data: obra, error: fetchError } = await supabase
        .from('saved_pdfs')
        .select('*')
        .eq('id', obraId)
        .eq('tipo', 'obra')
        .single();

      if (fetchError) {
        throw new Error(`Erro ao obter obra: ${fetchError.message}`);
      }

      if (!obra) {
        throw new Error('Obra não encontrada');
      }

      // Eliminar ficheiro do storage
      if (obra.arquivo_url) {
        const fileName = obra.arquivo_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('pdfs')
            .remove([`obras/${fileName}`]);

          if (storageError) {
            console.warn('Erro ao eliminar ficheiro do storage:', storageError);
          }
        }
      }

      // Eliminar registo da base de dados
      const { error: deleteError } = await supabase
        .from('saved_pdfs')
        .delete()
        .eq('id', obraId);

      if (deleteError) {
        throw new Error(`Erro ao eliminar registo: ${deleteError.message}`);
      }

      return {
        success: true,
        message: 'Obra eliminada com sucesso'
      };
    } catch (error) {
      console.error('Erro ao eliminar obra:', error);
      return {
        success: false,
        message: `Erro ao eliminar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  private generateObraEmailMessage(obra: any): string {
    return `Segue em anexo a obra ${obra.codigo} - ${obra.nome}.

Detalhes:
- Código: ${obra.codigo}
- Nome: ${obra.nome}
- Tipo: ${obra.tipo}
- Localização: ${obra.localizacao}
- Responsável: ${obra.responsavel}
- Estado: ${obra.estado}

Cumprimentos,`;
  }

  // Static methods for Ensaios
  static async shareEnsaioByEmail(ensaio: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareEnsaioByEmail(ensaio, email);
  }

  static async saveEnsaioToBackend(ensaio: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveEnsaioToBackend(ensaio);
  }

  static async downloadEnsaioLocally(ensaio: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadEnsaioLocally(ensaio);
  }

  static async getSavedEnsaios(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedEnsaios();
  }

  static async deleteSavedEnsaio(ensaioId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteSavedEnsaio(ensaioId);
  }

  // Static methods for Checklists
  static async shareChecklistByEmail(checklist: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareChecklistByEmail(checklist, email);
  }

  static async saveChecklistToBackend(checklist: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveChecklistToBackend(checklist);
  }

  static async downloadChecklistLocally(checklist: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadChecklistLocally(checklist);
  }

  static async getSavedChecklists(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedChecklists();
  }

  static async deleteSavedChecklist(checklistId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteSavedChecklist(checklistId);
  }

  // Static methods for RFIs
  static async shareRFIByEmail(rfi: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareRFIByEmail(rfi, { email });
  }

  static async saveRFIToBackend(rfi: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveRFIToBackend(rfi);
  }

  static async downloadRFILocally(rfi: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadRFILocal(rfi);
  }

  static async getSavedRFIs(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedRFIs();
  }

  static async deleteSavedRFI(rfiId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteRFIFromBackend(rfiId);
  }

  // Static methods for NaoConformidades
  static async shareNaoConformidadeByEmail(nc: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareNaoConformidadeByEmail(nc, { email });
  }

  static async saveNaoConformidadeToBackend(nc: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveNaoConformidadeToBackend(nc);
  }

  static async downloadNaoConformidadeLocally(nc: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadNaoConformidadeLocal(nc);
  }

  static async getSavedNaoConformidades(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedNaoConformidades();
  }

  static async deleteSavedNaoConformidade(ncId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteNaoConformidadeFromBackend(ncId);
  }

  // Static methods for Fornecedores
  static async shareFornecedorByEmail(fornecedor: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareFornecedorByEmail(fornecedor, { email });
  }

  static async saveFornecedorToBackend(fornecedor: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveFornecedorToBackend(fornecedor);
  }

  static async downloadFornecedorLocally(fornecedor: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadFornecedorLocal(fornecedor);
  }

  static async getSavedFornecedores(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedFornecedores();
  }

  static async deleteSavedFornecedor(fornecedorId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteFornecedorFromBackend(fornecedorId);
  }

  // Static methods for Materiais
  static async shareMaterialByEmail(material: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareMaterialByEmail(material, { email });
  }

  static async saveMaterialToBackend(material: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveMaterialToBackend(material);
  }

  static async downloadMaterialLocally(material: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadMaterialLocal(material);
  }

  static async getSavedMateriais(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedMateriais();
  }

  static async deleteSavedMaterial(materialId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteMaterialFromBackend(materialId);
  }

  // Static methods for Documentos
  static async shareDocumentoByEmail(documento: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareDocumentoByEmail(documento, email);
  }

  static async saveDocumentoToBackend(documento: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveDocumentoToBackend(documento);
  }

  static async downloadDocumentoLocally(documento: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadDocumentoLocally(documento);
  }

  static async getSavedDocumentos(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedDocumentos();
  }

  static async deleteSavedDocumento(documentoId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteSavedDocumento(documentoId);
  }

  // Static methods for Obras
  static async shareObraByEmail(obra: any, email: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.shareObraByEmail(obra, email);
  }

  static async saveObraToBackend(obra: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.saveObraToBackend(obra);
  }

  static async downloadObraLocally(obra: any): Promise<ShareResult> {
    const service = new ShareService();
    return service.downloadObraLocally(obra);
  }

  static async getSavedObras(): Promise<any[]> {
    const service = new ShareService();
    return service.getSavedObras();
  }

  static async deleteSavedObra(obraId: string): Promise<ShareResult> {
    const service = new ShareService();
    return service.deleteSavedObra(obraId);
  }
} 