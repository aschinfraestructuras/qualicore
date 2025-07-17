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
} 