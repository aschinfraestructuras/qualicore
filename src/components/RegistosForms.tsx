import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Download, Upload, Calendar, User, MapPin, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Registo } from '../types/certificados';
import { certificadosAPI } from '../lib/supabase-api/certificadosAPI';
import { storageService } from '../lib/supabase-storage';

interface RegistosFormsProps {
  registo?: Registo;
  onClose: () => void;
  onSave: (registo: Registo) => void;
}

const RegistosForms: React.FC<RegistosFormsProps> = ({
  registo,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Registo>>({
    codigo: '',
    titulo: '',
    descricao: '',
    tipo_registo: 'auditoria',
    categoria: 'qualidade',
    data_registo: '',
    data_ocorrencia: '',
    data_limite: '',
    data_conclusao: '',
    status: 'pendente',
    prioridade: 'media',
    responsavel_id: '',
    responsavel_nome: '',
    responsavel_email: '',
    responsavel_telefone: '',
    localizacao: '',
    departamento: '',
    equipamento: '',
    processo: '',
    especificacoes_tecnicas: '',
    resultados: '',
    conclusoes: '',
    recomendacoes: '',
    documentos_anexos: [],
    fotografias: [],
    certificado_id: '',
    obra_id: '',
    fornecedor_id: '',
    material_id: '',
    observacoes: '',
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (registo) {
      setFormData({
        ...registo,
        data_registo: registo.data_registo ? new Date(registo.data_registo).toISOString().split('T')[0] : '',
        data_ocorrencia: registo.data_ocorrencia ? new Date(registo.data_ocorrencia).toISOString().split('T')[0] : '',
        data_limite: registo.data_limite ? new Date(registo.data_limite).toISOString().split('T')[0] : '',
        data_conclusao: registo.data_conclusao ? new Date(registo.data_conclusao).toISOString().split('T')[0] : ''
      });
    }
  }, [registo]);

  const handleInputChange = (field: keyof Registo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof Registo, value: string) => {
    if (value.trim()) {
      const currentArray = (formData[field] as string[]) || [];
      if (!currentArray.includes(value.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }));
      }
    }
  };

  const removeFromArray = (field: keyof Registo, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
      const folder = 'registos/documentos';
      
      const result = await storageService.uploadFile(file, folder, bucket);
      
      const newDocument = {
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        url: result.url,
        path: result.path,
        data_upload: new Date().toISOString()
      };

      const documentos = [...(formData.documentos_anexos || []), newDocument];
      setFormData(prev => ({ ...prev, documentos_anexos: documentos }));
      
      toast.success('Documento carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar documento:', error);
      toast.error('Erro ao carregar documento');
    } finally {
      setUploadingFile(false);
      if (event.target) event.target.value = '';
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
      const folder = 'registos/fotografias';
      
      const result = await storageService.uploadFile(file, folder, bucket);
      
      const newPhoto = {
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        url: result.url,
        path: result.path,
        data_upload: new Date().toISOString(),
        descricao: ''
      };

      const fotografias = [...(formData.fotografias || []), newPhoto];
      setFormData(prev => ({ ...prev, fotografias: fotografias }));
      
      toast.success('Fotografia carregada com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar fotografia:', error);
      toast.error('Erro ao carregar fotografia');
    } finally {
      setUploadingPhoto(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleFileDownload = async (documento: any) => {
    try {
      const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
      await storageService.downloadFile(documento.path, documento.nome, bucket);
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Erro ao descarregar documento:', error);
      toast.error('Erro ao descarregar documento');
    }
  };

  const removeDocument = async (index: number) => {
    const documentos = formData.documentos_anexos || [];
    const documento = documentos[index];
    
    try {
      if (documento.path) {
        const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
        await storageService.deleteFile(documento.path, bucket);
      }
      
      const newDocumentos = documentos.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, documentos_anexos: newDocumentos }));
      
      toast.success('Documento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      toast.error('Erro ao remover documento');
    }
  };

  const removePhoto = async (index: number) => {
    const fotografias = formData.fotografias || [];
    const foto = fotografias[index];
    
    try {
      if (foto.path) {
        const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
        await storageService.deleteFile(foto.path, bucket);
      }
      
      const newFotografias = fotografias.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, fotografias: newFotografias }));
      
      toast.success('Fotografia removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover fotografia:', error);
      toast.error('Erro ao remover fotografia');
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'codigo', 'titulo', 'tipo_registo', 'categoria', 'data_registo',
      'responsavel_nome'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof Registo]) {
        toast.error(`Campo obrigatório: ${field}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const userId = await certificadosAPI.getCurrentUserId();
      console.log('User ID obtido:', userId);
      
      if (!userId) {
        toast.error('Erro: Não foi possível obter o ID do usuário');
        return;
      }
      
      const registoData = {
        ...formData,
        user_id: userId
      } as Registo;
      
      console.log('Dados do registo a serem enviados:', registoData);

      if (registo?.id) {
        await certificadosAPI.registos.update(registo.id, registoData);
        toast.success('Registo atualizado com sucesso!');
      } else {
        const newRegisto = await certificadosAPI.registos.create(registoData);
        toast.success('Registo criado com sucesso!');
        onSave(newRegisto);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar registo:', error);
      toast.error('Erro ao salvar registo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {registo ? 'Editar Registo' : 'Novo Registo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                value={formData.codigo || ''}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="REG-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo || ''}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Auditoria Interna de Qualidade"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Registo *
              </label>
              <select
                value={formData.tipo_registo || ''}
                onChange={(e) => handleInputChange('tipo_registo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione...</option>
                <option value="auditoria">Auditoria</option>
                <option value="inspecao">Inspeção</option>
                <option value="ensaio">Ensaio</option>
                <option value="calibracao">Calibração</option>
                <option value="manutencao">Manutenção</option>
                <option value="formacao">Formação</option>
                <option value="competencia">Competência</option>
                <option value="acidente">Acidente</option>
                <option value="incidente">Incidente</option>
                <option value="nao_conformidade">Não Conformidade</option>
                <option value="acao_corretiva">Ação Corretiva</option>
                <option value="acao_preventiva">Ação Preventiva</option>
                <option value="melhoria">Melhoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoria || ''}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione...</option>
                <option value="qualidade">Qualidade</option>
                <option value="ambiente">Ambiente</option>
                <option value="seguranca">Segurança</option>
                <option value="saude">Saúde</option>
                <option value="energia">Energia</option>
                <option value="manutencao">Manutenção</option>
                <option value="formacao">Formação</option>
                <option value="equipamento">Equipamento</option>
                <option value="processo">Processo</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao || ''}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição detalhada do registo..."
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Registo *
              </label>
              <input
                type="date"
                value={formData.data_registo || ''}
                onChange={(e) => handleInputChange('data_registo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Ocorrência
              </label>
              <input
                type="date"
                value={formData.data_ocorrencia || ''}
                onChange={(e) => handleInputChange('data_ocorrencia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Limite
              </label>
              <input
                type="date"
                value={formData.data_limite || ''}
                onChange={(e) => handleInputChange('data_limite', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Conclusão
              </label>
              <input
                type="date"
                value={formData.data_conclusao || ''}
                onChange={(e) => handleInputChange('data_conclusao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status || 'pendente'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
                <option value="suspenso">Suspenso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={formData.prioridade || 'media'}
                onChange={(e) => handleInputChange('prioridade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Responsável */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Responsável *
              </label>
              <input
                type="text"
                value={formData.responsavel_nome || ''}
                onChange={(e) => handleInputChange('responsavel_nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ana Oliveira"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Responsável
              </label>
              <input
                type="email"
                value={formData.responsavel_email || ''}
                onChange={(e) => handleInputChange('responsavel_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ana.oliveira@empresa.pt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone do Responsável
              </label>
              <input
                type="tel"
                value={formData.responsavel_telefone || ''}
                onChange={(e) => handleInputChange('responsavel_telefone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+351 213 456 789"
              />
            </div>
          </div>

          {/* Localização e Contexto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <input
                type="text"
                value={formData.localizacao || ''}
                onChange={(e) => handleInputChange('localizacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sala de Reuniões"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <input
                type="text"
                value={formData.departamento || ''}
                onChange={(e) => handleInputChange('departamento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Qualidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipamento
              </label>
              <input
                type="text"
                value={formData.equipamento || ''}
                onChange={(e) => handleInputChange('equipamento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Equipamento específico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processo
              </label>
              <input
                type="text"
                value={formData.processo || ''}
                onChange={(e) => handleInputChange('processo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Processo específico"
              />
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especificações Técnicas
              </label>
              <textarea
                value={formData.especificacoes_tecnicas || ''}
                onChange={(e) => handleInputChange('especificacoes_tecnicas', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Especificações técnicas relevantes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultados
              </label>
              <textarea
                value={formData.resultados || ''}
                onChange={(e) => handleInputChange('resultados', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resultados obtidos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conclusões
              </label>
              <textarea
                value={formData.conclusoes || ''}
                onChange={(e) => handleInputChange('conclusoes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Conclusões do registo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recomendações
              </label>
              <textarea
                value={formData.recomendacoes || ''}
                onChange={(e) => handleInputChange('recomendacoes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Recomendações para melhorias..."
              />
            </div>
          </div>

          {/* Documentos Anexos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documentos Anexos
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                disabled={uploadingFile}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  uploadingFile
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploadingFile ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                    Carregando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Documento
                  </>
                )}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                PDF, DOC, XLS, JPG, PNG (máx. 10MB)
              </p>
            </div>

            {/* Lista de documentos */}
            {formData.documentos_anexos && formData.documentos_anexos.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.documentos_anexos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.tamanho / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleFileDownload(doc)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Descarregar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fotografias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotografias
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                accept=".jpg,.jpeg,.png,.gif"
                disabled={uploadingPhoto}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  uploadingPhoto
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {uploadingPhoto ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                    Carregando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Fotografia
                  </>
                )}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG, GIF (máx. 5MB)
              </p>
            </div>

            {/* Lista de fotografias */}
            {formData.fotografias && formData.fotografias.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {formData.fotografias.map((foto, index) => (
                  <div key={index} className="relative bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{foto.nome}</p>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="aspect-video bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                      <img
                        src={foto.url}
                        alt={foto.nome}
                        className="max-w-full max-h-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {(foto.tamanho / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Registo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistosForms;
