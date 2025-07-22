import React, { useState, useRef } from 'react';
import { Upload, File, Download, Eye, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

interface DocumentUploadProps {
  recordId: string;
  recordType: 'obra' | 'ensaio' | 'material' | 'fornecedor' | 'documento' | 'rfi' | 'nao_conformidade' | 'checklist' | 'ensaio_compactacao';
  onDocumentsChange?: (documents: Document[]) => void;
  existingDocuments?: Document[];
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export default function DocumentUpload({
  recordId,
  recordType,
  onDocumentsChange,
  existingDocuments = [],
  maxFiles = 10,
  maxSizeMB = 10,
  allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png']
}: DocumentUploadProps) {

  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [uploading, setUploading] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📁 handleFileSelect chamado!");
    console.log("📁 Files:", event.target.files);

    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log("📁 Nenhum arquivo selecionado");
      return;
    }

    // Verificar autenticação
    console.log("🔐 Verificando autenticação...");
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔐 User auth check:', user);
    
    if (!user) {
      console.log("❌ Usuário não autenticado!");
      toast.error('Precisa estar autenticado para fazer upload!');
      return;
    }
    console.log("✅ Usuário autenticado:", user.email);

    // Verificar limite de arquivos
    if (documents.length + files.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitido`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Verificar tamanho
        if (file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`Arquivo ${file.name} excede ${maxSizeMB}MB`);
        }

        // Verificar tipo
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          throw new Error(`Tipo de arquivo ${fileExtension} não permitido`);
        }

        // Gerar nome único com caracteres seguros
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}_${safeFileName}`;
        const actualRecordId = recordId === 'new' ? `temp_${Date.now()}` : recordId;
        const filePath = `${recordType}/${actualRecordId}/${fileName}`;

        console.log('📁 Uploading:', fileName, 'to path:', filePath);
        console.log('📁 User:', user.email);

        // Upload para Supabase Storage (igual ao teste)
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (error) {
          console.error('📁 Upload error:', error);
          throw error;
        }

        console.log('📁 Upload success:', data);



        // Gerar URL pública (igual ao teste)
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        console.log('📁 URL data:', urlData);



        const document: Document = {
          id: data.path,
          name: file.name,
          url: urlData.publicUrl,
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString()
        };


        return document;
      });

      const newDocuments = await Promise.all(uploadPromises);
      console.log('📁 Novos documentos criados:', newDocuments);
      
      const updatedDocuments = [...documents, ...newDocuments];
      console.log('📁 Documentos atualizados:', updatedDocuments);
      
      setDocuments(updatedDocuments);
      onDocumentsChange?.(updatedDocuments);
      
      toast.success(`${newDocuments.length} documento(s) carregado(s) com sucesso!`);
    } catch (error: any) {
      console.error('📁 Erro no upload:', error);
      console.error('📁 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      toast.error(error.message || 'Erro ao carregar documentos');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    try {
      // Remover do Storage
      const { error } = await supabase.storage
        .from('documents')
        .remove([document.id]);

      if (error) throw error;

      // Atualizar lista
      const updatedDocuments = documents.filter(d => d.id !== document.id);
      setDocuments(updatedDocuments);
      onDocumentsChange?.(updatedDocuments);
      
      toast.success('Documento removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover documento:', error);
      toast.error('Erro ao remover documento');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  const openDocument = (document: Document) => {
    setViewingDocument(document);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="flex flex-col items-center space-y-2 w-full"
        >
          <Upload className={`h-8 w-8 ${uploading ? 'text-gray-400' : 'text-blue-500'}`} />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {uploading ? 'Carregando...' : 'Clique para carregar documentos'}
            </p>
            <p className="text-xs text-gray-500">
              {allowedTypes.join(', ')} • Máx {maxSizeMB}MB • Máx {maxFiles} arquivos
            </p>
          </div>
        </button>
        

      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Documentos ({documents.length})</h4>
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileIcon(document.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{document.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.size)} • {new Date(document.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openDocument(document)}
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </button>
                  
                  <a
                    href={document.url}
                    download={document.name}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-green-600" />
                  </a>
                  
                  <button
                    onClick={() => handleDeleteDocument(document)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">{viewingDocument.name}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 h-96 overflow-auto">
              {viewingDocument.type.includes('pdf') ? (
                <iframe
                  src={viewingDocument.url}
                  className="w-full h-full border-0"
                  title={viewingDocument.name}
                />
              ) : viewingDocument.type.includes('image') ? (
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.name}
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Visualização não disponível para este tipo de arquivo
                    </p>
                    <a
                      href={viewingDocument.url}
                      download={viewingDocument.name}
                      className="btn btn-primary"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
