import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Download, Upload, Calendar, User, Building, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Certificado } from '../types/certificados';
import { certificadosAPI } from '../lib/supabase-api/certificadosAPI';
import { storageService } from '../lib/supabase-storage';

interface CertificadosFormsProps {
  certificado?: Certificado;
  onClose: () => void;
  onSave: (certificado: Certificado) => void;
}

const CertificadosForms: React.FC<CertificadosFormsProps> = ({
  certificado,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Certificado>>({
    codigo: '',
    titulo: '',
    descricao: '',
    tipo_certificado: 'qualidade_sistema',
    categoria: 'sistema_gestao',
    escopo: '',
    normas_referencia: [],
    entidade_certificadora: '',
    organismo_acreditacao: '',
    numero_acreditacao: '',
    data_emissao: '',
    data_validade: '',
    data_renovacao: '',
    data_suspensao: '',
    data_cancelamento: '',
    status: 'ativo',
    estado: 'valido',
    responsavel_id: '',
    responsavel_nome: '',
    responsavel_email: '',
    responsavel_telefone: '',
    nivel_certificacao: '',
    ambito_geografico: '',
    restricoes: '',
    condicoes_especiais: '',
    documentos_anexos: [],
    certificado_original_url: '',
    certificado_digital_url: '',
    ultima_auditoria: '',
    proxima_auditoria: '',
    frequencia_auditorias: '',
    historico_renovacoes: [],
    custo_emissao: 0,
    custo_manutencao: 0,
    custo_renovacao: 0,
    moeda: 'EUR',
    observacoes: '',
    palavras_chave: [],
    tags: [],
    classificacao_confidencialidade: 'interno',
    obra_id: '',
    fornecedor_id: '',
    material_id: '',
    equipamento_id: '',
    versao: '1.0',
    versao_anterior_id: ''
  });

  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newNorma, setNewNorma] = useState('');
  const [newPalavraChave, setNewPalavraChave] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (certificado) {
      setFormData({
        ...certificado,
        data_emissao: certificado.data_emissao ? new Date(certificado.data_emissao).toISOString().split('T')[0] : '',
        data_validade: certificado.data_validade ? new Date(certificado.data_validade).toISOString().split('T')[0] : '',
        data_renovacao: certificado.data_renovacao ? new Date(certificado.data_renovacao).toISOString().split('T')[0] : '',
        data_suspensao: certificado.data_suspensao ? new Date(certificado.data_suspensao).toISOString().split('T')[0] : '',
        data_cancelamento: certificado.data_cancelamento ? new Date(certificado.data_cancelamento).toISOString().split('T')[0] : '',
        ultima_auditoria: certificado.ultima_auditoria ? new Date(certificado.ultima_auditoria).toISOString().split('T')[0] : '',
        proxima_auditoria: certificado.proxima_auditoria ? new Date(certificado.proxima_auditoria).toISOString().split('T')[0] : ''
      });
    }
  }, [certificado]);

  const handleInputChange = (field: keyof Certificado, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof Certificado, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof Certificado, value: string) => {
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

  const removeFromArray = (field: keyof Certificado, index: number) => {
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
      const folder = 'certificados';
      
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

  const validateForm = (): boolean => {
    const requiredFields = [
      'codigo', 'titulo', 'tipo_certificado', 'categoria', 'escopo',
      'entidade_certificadora', 'data_emissao', 'data_validade',
      'responsavel_nome'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof Certificado]) {
        toast.error(`Campo obrigatório: ${field}`);
        return false;
      }
    }

    if (formData.data_validade && formData.data_emissao) {
      const dataEmissao = new Date(formData.data_emissao);
      const dataValidade = new Date(formData.data_validade);
      if (dataValidade <= dataEmissao) {
        toast.error('Data de validade deve ser posterior à data de emissão');
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
      
      const certificadoData = {
        ...formData,
        user_id: userId,
        custo_emissao: Number(formData.custo_emissao) || 0,
        custo_manutencao: Number(formData.custo_manutencao) || 0,
        custo_renovacao: Number(formData.custo_renovacao) || 0
      } as Certificado;
      
      console.log('Dados do certificado a serem enviados:', certificadoData);

      if (certificado?.id) {
        await certificadosAPI.certificados.update(certificado.id, certificadoData);
        toast.success('Certificado atualizado com sucesso!');
      } else {
        const newCertificado = await certificadosAPI.certificados.create(certificadoData);
        toast.success('Certificado criado com sucesso!');
        onSave(newCertificado);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar certificado:', error);
      toast.error('Erro ao salvar certificado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {certificado ? 'Editar Certificado' : 'Novo Certificado'}
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
                placeholder="CERT-001"
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
                placeholder="Certificado de Qualidade ISO 9001:2015"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Certificado *
              </label>
              <select
                value={formData.tipo_certificado || ''}
                onChange={(e) => handleInputChange('tipo_certificado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione...</option>
                <option value="qualidade_sistema">Qualidade Sistema</option>
                <option value="qualidade_produto">Qualidade Produto</option>
                <option value="ambiente">Ambiente</option>
                <option value="seguranca">Segurança</option>
                <option value="energia">Energia</option>
                <option value="alimentar">Alimentar</option>
                <option value="construcao">Construção</option>
                <option value="laboratorio">Laboratório</option>
                <option value="calibracao">Calibração</option>
                <option value="inspectao">Inspeção</option>
                <option value="manutencao">Manutenção</option>
                <option value="formacao">Formação</option>
                <option value="competencia">Competência</option>
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
                <option value="sistema_gestao">Sistema Gestão</option>
                <option value="produto_servico">Produto/Serviço</option>
                <option value="pessoal">Pessoal</option>
                <option value="equipamento">Equipamento</option>
                <option value="processo">Processo</option>
                <option value="fornecedor">Fornecedor</option>
                <option value="cliente">Cliente</option>
                <option value="regulamentar">Regulamentar</option>
                <option value="voluntario">Voluntário</option>
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
              placeholder="Descrição detalhada do certificado..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escopo *
            </label>
            <textarea
              value={formData.escopo || ''}
              onChange={(e) => handleInputChange('escopo', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escopo de aplicação do certificado..."
              required
            />
          </div>

          {/* Entidade Certificadora */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entidade Certificadora *
              </label>
              <input
                type="text"
                value={formData.entidade_certificadora || ''}
                onChange={(e) => handleInputChange('entidade_certificadora', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bureau Veritas Portugal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organismo de Acreditação
              </label>
              <input
                type="text"
                value={formData.organismo_acreditacao || ''}
                onChange={(e) => handleInputChange('organismo_acreditacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IPAC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Acreditação
              </label>
              <input
                type="text"
                value={formData.numero_acreditacao || ''}
                onChange={(e) => handleInputChange('numero_acreditacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ACC-001"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Emissão *
              </label>
              <input
                type="date"
                value={formData.data_emissao || ''}
                onChange={(e) => handleInputChange('data_emissao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Validade *
              </label>
              <input
                type="date"
                value={formData.data_validade || ''}
                onChange={(e) => handleInputChange('data_validade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Renovação
              </label>
              <input
                type="date"
                value={formData.data_renovacao || ''}
                onChange={(e) => handleInputChange('data_renovacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status || 'ativo'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ativo">Ativo</option>
                <option value="suspenso">Suspenso</option>
                <option value="cancelado">Cancelado</option>
                <option value="expirado">Expirado</option>
                <option value="em_renovacao">Em Renovação</option>
                <option value="em_suspensao">Em Suspensão</option>
                <option value="cancelado_voluntario">Cancelado Voluntário</option>
                <option value="cancelado_obrigatorio">Cancelado Obrigatório</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado || 'valido'}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="valido">Válido</option>
                <option value="proximo_expiracao">Próximo Expiração</option>
                <option value="expirado">Expirado</option>
                <option value="suspenso">Suspenso</option>
                <option value="cancelado">Cancelado</option>
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
                placeholder="João Silva"
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
                placeholder="joao.silva@empresa.pt"
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

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Certificação
              </label>
              <input
                type="text"
                value={formData.nivel_certificacao || ''}
                onChange={(e) => handleInputChange('nivel_certificacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nível A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Âmbito Geográfico
              </label>
              <input
                type="text"
                value={formData.ambito_geografico || ''}
                onChange={(e) => handleInputChange('ambito_geografico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Portugal"
              />
            </div>
          </div>

          {/* Custos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo de Emissão (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.custo_emissao || 0}
                onChange={(e) => handleInputChange('custo_emissao', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo de Manutenção (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.custo_manutencao || 0}
                onChange={(e) => handleInputChange('custo_manutencao', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo de Renovação (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.custo_renovacao || 0}
                onChange={(e) => handleInputChange('custo_renovacao', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moeda
              </label>
              <select
                value={formData.moeda || 'EUR'}
                onChange={(e) => handleInputChange('moeda', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
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
                'Guardar Certificado'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificadosForms;
