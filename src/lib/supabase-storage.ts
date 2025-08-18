import { supabase } from './supabase';

export interface FileUploadResult {
  url: string;
  path: string;
  size: number;
  name: string;
  type: string;
}

export interface FileMetadata {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  path: string;
}

// Buckets utilizados (configuráveis por ENV). Defaults alinham com buckets já existentes no projeto
const BUCKETS = {
  normas: (import.meta as any).env?.VITE_SUPABASE_BUCKET_NORMAS || 'documents',
  certificados: (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents',
  padrao: (import.meta as any).env?.VITE_SUPABASE_BUCKET_PADRAO || 'documents'
};

export const storageService = {
  // Upload de ficheiro com bucket configurável
  async uploadFile(
    file: File,
    folder: string = 'uploads',
    bucket?: string
  ): Promise<FileUploadResult> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      const bucketToUse = bucket || (folder === 'normas' ? BUCKETS.normas : folder === 'certificados' ? BUCKETS.certificados : BUCKETS.padrao);

      const { data, error } = await supabase.storage
        .from(bucketToUse)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from(bucketToUse)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        name: file.name,
        type: file.type
      };
    } catch (error) {
      console.error('Erro no upload do ficheiro:', error);
      throw error;
    }
  },

  // Download de ficheiro
  async downloadFile(filePath: string, fileName: string, bucket?: string): Promise<void> {
    try {
      const bucketToUse = bucket || BUCKETS.padrao;
      const { data, error } = await supabase.storage
        .from(bucketToUse)
        .download(filePath);

      if (error) {
        console.error('Erro no download:', error);
        throw new Error(`Erro no download: ${error.message}`);
      }

      // Criar link de download
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro no download do ficheiro:', error);
      throw error;
    }
  },

  // Eliminar ficheiro
  async deleteFile(filePath: string, bucket?: string): Promise<void> {
    try {
      const bucketToUse = bucket || BUCKETS.padrao;
      const { error } = await supabase.storage
        .from(bucketToUse)
        .remove([filePath]);

      if (error) {
        console.error('Erro ao eliminar ficheiro:', error);
        throw new Error(`Erro ao eliminar ficheiro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao eliminar ficheiro:', error);
      throw error;
    }
  },

  // Listar ficheiros num bucket
  async listFiles(bucket: string = BUCKETS.padrao, folder?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '');

      if (error) {
        console.error('Erro ao listar ficheiros:', error);
        throw new Error(`Erro ao listar ficheiros: ${error.message}`);
      }

      return data.map(file => file.name);
    } catch (error) {
      console.error('Erro ao listar ficheiros:', error);
      throw error;
    }
  },

  // Obter URL pública de um ficheiro
  getPublicUrl(filePath: string, bucket: string = BUCKETS.padrao): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Validar tipo de ficheiro
  validateFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    return allowedTypes.includes(file.type);
  },

  // Validar tamanho do ficheiro (máximo 10MB)
  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // Formatar tamanho do ficheiro
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Obter ícone baseado no tipo de ficheiro
  getFileIcon(tipo: string): string {
    if (tipo.includes('pdf')) return '📄';
    if (tipo.includes('word') || tipo.includes('document')) return '📝';
    if (tipo.includes('excel') || tipo.includes('spreadsheet')) return '📊';
    if (tipo.includes('image')) return '🖼️';
    if (tipo.includes('text')) return '📄';
    return '📎';
  }
};
