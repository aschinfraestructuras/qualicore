import React, { useState, useEffect } from 'react';
import { X, Upload, Download, Camera, FileText, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao,
  TIPOS_EQUIPAMENTO,
  CATEGORIAS_EQUIPAMENTO,
  ESTADOS_EQUIPAMENTO,
  STATUS_OPERACIONAL,
  TIPOS_CALIBRACAO,
  RESULTADOS_CALIBRACAO,
  TIPOS_MANUTENCAO,
  RESULTADOS_MANUTENCAO,
  TIPOS_INSPECAO,
  RESULTADOS_INSPECAO
} from '@/types/calibracoes';
import { 
  createEquipamento, 
  updateEquipamento,
  createCalibracao,
  updateCalibracao,
  createManutencao,
  updateManutencao,
  createInspecao,
  updateInspecao
} from '../lib/supabase-api/calibracoesAPI';
import DocumentUpload from './DocumentUpload';

interface CalibracoesEquipamentosFormsProps {
  activeTab: 'equipamentos' | 'calibracoes' | 'manutencoes' | 'inspecoes';
  editingItem: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CalibracoesEquipamentosForms({
  activeTab,
  editingItem,
  onClose,
  onSuccess
}: CalibracoesEquipamentosFormsProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData(getDefaultFormData());
    }
  }, [editingItem, activeTab]);

  const getDefaultFormData = () => {
    switch (activeTab) {
      case 'equipamentos':
        return {
          codigo: '',
          nome: '',
          tipo: '',
          categoria: '',
          marca: '',
          modelo: '',
          numero_serie: '',
          localizacao: '',
          departamento: '',
          responsavel: '',
          data_aquisicao: '',
          data_instalacao: '',
          estado: 'ativo',
          status_operacional: 'operacional',
          fabricante: '',
          fornecedor: '',
          garantia_ate: '',
          vida_util_anos: 10,
          valor_aquisicao: 0,
          observacoes: '',
          fotos: [],
          documentos: []
        };
      case 'calibracoes':
        return {
          equipamento_id: '',
          numero_calibracao: '',
          tipo_calibracao: 'periodica',
          data_calibracao: '',
          data_proxima_calibracao: '',
          laboratorio: '',
          tecnico_responsavel: '',
          certificado_calibracao: '',
          resultado: 'aprovado',
          incerteza_medicao: 0,
          unidade_incerteza: '',
          pontos_calibracao: [],
          observacoes: '',
          custo: 0,
          documentos: [],
          fotos: []
        };
      case 'manutencoes':
        return {
          equipamento_id: '',
          tipo_manutencao: 'preventiva',
          data_manutencao: '',
          data_proxima_manutencao: '',
          descricao: '',
          acoes_realizadas: '',
          pecas_substituidas: '',
          custo: 0,
          tecnico_responsavel: '',
          fornecedor: '',
          resultado: 'concluida',
          observacoes: '',
          documentos: [],
          fotos: []
        };
      case 'inspecoes':
        return {
          equipamento_id: '',
          data_inspecao: '',
          tipo_inspecao: 'rotina',
          inspetor: '',
          resultado: 'aprovado',
          criterios_avaliados: [],
          observacoes: '',
          acoes_corretivas: '',
          fotos: [],
          documentos: []
        };
      default:
        return {};
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (activeTab) {
        case 'equipamentos':
          if (editingItem) {
            await updateEquipamento(editingItem.id, formData);
          } else {
            await createEquipamento(formData);
          }
          break;
        case 'calibracoes':
          if (editingItem) {
            await updateCalibracao(editingItem.id, formData);
          } else {
            await createCalibracao(formData);
          }
          break;
        case 'manutencoes':
          if (editingItem) {
            await updateManutencao(editingItem.id, formData);
          } else {
            await createManutencao(formData);
          }
          break;
        case 'inspecoes':
          if (editingItem) {
            await updateInspecao(editingItem.id, formData);
          } else {
            await createInspecao(formData);
          }
          break;
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar dados');
    } finally {
      setLoading(false);
    }
  };

  const renderEquipamentoForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
        <input
          type="text"
          value={formData.codigo || ''}
          onChange={(e) => handleInputChange('codigo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          type="text"
          value={formData.nome || ''}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
        <select
          value={formData.tipo || ''}
          onChange={(e) => handleInputChange('tipo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="">Selecionar tipo</option>
          {TIPOS_EQUIPAMENTO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
        <select
          value={formData.categoria || ''}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="">Selecionar categoria</option>
          {CATEGORIAS_EQUIPAMENTO.map((categoria) => (
            <option key={categoria.value} value={categoria.value}>{categoria.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
        <input
          type="text"
          value={formData.marca || ''}
          onChange={(e) => handleInputChange('marca', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
        <input
          type="text"
          value={formData.modelo || ''}
          onChange={(e) => handleInputChange('modelo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
        <input
          type="text"
          value={formData.numero_serie || ''}
          onChange={(e) => handleInputChange('numero_serie', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
        <input
          type="text"
          value={formData.localizacao || ''}
          onChange={(e) => handleInputChange('localizacao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
        <input
          type="text"
          value={formData.departamento || ''}
          onChange={(e) => handleInputChange('departamento', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
        <input
          type="text"
          value={formData.responsavel || ''}
          onChange={(e) => handleInputChange('responsavel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Aquisição</label>
        <input
          type="date"
          value={formData.data_aquisicao || ''}
          onChange={(e) => handleInputChange('data_aquisicao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Instalação</label>
        <input
          type="date"
          value={formData.data_instalacao || ''}
          onChange={(e) => handleInputChange('data_instalacao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          value={formData.estado || 'ativo'}
          onChange={(e) => handleInputChange('estado', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {ESTADOS_EQUIPAMENTO.map((estado) => (
            <option key={estado.value} value={estado.value}>{estado.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Operacional</label>
        <select
          value={formData.status_operacional || 'operacional'}
          onChange={(e) => handleInputChange('status_operacional', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPERACIONAL.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
        <input
          type="text"
          value={formData.fabricante || ''}
          onChange={(e) => handleInputChange('fabricante', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
        <input
          type="text"
          value={formData.fornecedor || ''}
          onChange={(e) => handleInputChange('fornecedor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Garantia Até</label>
        <input
          type="date"
          value={formData.garantia_ate || ''}
          onChange={(e) => handleInputChange('garantia_ate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vida Útil (anos)</label>
        <input
          type="number"
          value={formData.vida_util_anos || 10}
          onChange={(e) => handleInputChange('vida_util_anos', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Aquisição (€)</label>
        <input
          type="number"
          step="0.01"
          value={formData.valor_aquisicao || 0}
          onChange={(e) => handleInputChange('valor_aquisicao', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Upload de Fotos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-1" />
          Fotografias
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="equipamento"
          onDocumentsChange={(docs) => handleInputChange('fotos', docs)}
          existingDocuments={formData.fotos || []}
          maxFiles={10}
          maxSizeMB={5}
          allowedTypes={['.jpg', '.jpeg', '.png', '.gif']}
        />
      </div>

      {/* Upload de Documentos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Documentos
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="equipamento"
          onDocumentsChange={(docs) => handleInputChange('documentos', docs)}
          existingDocuments={formData.documentos || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
        />
      </div>
    </div>
  );

  const renderCalibracaoForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Calibração *</label>
        <input
          type="text"
          value={formData.numero_calibracao || ''}
          onChange={(e) => handleInputChange('numero_calibracao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Calibração</label>
        <select
          value={formData.tipo_calibracao || 'periodica'}
          onChange={(e) => handleInputChange('tipo_calibracao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIPOS_CALIBRACAO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Calibração</label>
        <input
          type="date"
          value={formData.data_calibracao || ''}
          onChange={(e) => handleInputChange('data_calibracao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Calibração</label>
        <input
          type="date"
          value={formData.data_proxima_calibracao || ''}
          onChange={(e) => handleInputChange('data_proxima_calibracao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Laboratório</label>
        <input
          type="text"
          value={formData.laboratorio || ''}
          onChange={(e) => handleInputChange('laboratorio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Técnico Responsável</label>
        <input
          type="text"
          value={formData.tecnico_responsavel || ''}
          onChange={(e) => handleInputChange('tecnico_responsavel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Certificado de Calibração</label>
        <input
          type="text"
          value={formData.certificado_calibracao || ''}
          onChange={(e) => handleInputChange('certificado_calibracao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
        <select
          value={formData.resultado || 'aprovado'}
          onChange={(e) => handleInputChange('resultado', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {RESULTADOS_CALIBRACAO.map((resultado) => (
            <option key={resultado.value} value={resultado.value}>{resultado.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Incerteza de Medição</label>
        <input
          type="number"
          step="0.001"
          value={formData.incerteza_medicao || 0}
          onChange={(e) => handleInputChange('incerteza_medicao', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Incerteza</label>
        <input
          type="text"
          value={formData.unidade_incerteza || ''}
          onChange={(e) => handleInputChange('unidade_incerteza', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custo (€)</label>
        <input
          type="number"
          step="0.01"
          value={formData.custo || 0}
          onChange={(e) => handleInputChange('custo', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Upload de Documentos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Documentos de Calibração
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="calibracao"
          onDocumentsChange={(docs) => handleInputChange('documentos', docs)}
          existingDocuments={formData.documentos || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
        />
      </div>

      {/* Upload de Fotos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-1" />
          Fotografias da Calibração
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="calibracao"
          onDocumentsChange={(docs) => handleInputChange('fotos', docs)}
          existingDocuments={formData.fotos || []}
          maxFiles={10}
          maxSizeMB={5}
          allowedTypes={['.jpg', '.jpeg', '.png', '.gif']}
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'equipamentos':
        return renderEquipamentoForm();
      case 'calibracoes':
        return renderCalibracaoForm();
      case 'manutencoes':
        return renderManutencaoForm();
      case 'inspecoes':
        return renderInspecaoForm();
      default:
        return null;
    }
  };

  const renderManutencaoForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Campos básicos de manutenção */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Manutenção</label>
        <select
          value={formData.tipo_manutencao || 'preventiva'}
          onChange={(e) => handleInputChange('tipo_manutencao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIPOS_MANUTENCAO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Manutenção</label>
        <input
          type="date"
          value={formData.data_manutencao || ''}
          onChange={(e) => handleInputChange('data_manutencao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={formData.descricao || ''}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Upload de Documentos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Documentos de Manutenção
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="manutencao"
          onDocumentsChange={(docs) => handleInputChange('documentos', docs)}
          existingDocuments={formData.documentos || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
        />
      </div>

      {/* Upload de Fotos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-1" />
          Fotografias da Manutenção
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="manutencao"
          onDocumentsChange={(docs) => handleInputChange('fotos', docs)}
          existingDocuments={formData.fotos || []}
          maxFiles={10}
          maxSizeMB={5}
          allowedTypes={['.jpg', '.jpeg', '.png', '.gif']}
        />
      </div>
    </div>
  );

  const renderInspecaoForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Campos básicos de inspeção */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Inspeção</label>
        <select
          value={formData.tipo_inspecao || 'rotina'}
          onChange={(e) => handleInputChange('tipo_inspecao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIPOS_INSPECAO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Inspeção</label>
        <input
          type="date"
          value={formData.data_inspecao || ''}
          onChange={(e) => handleInputChange('data_inspecao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Upload de Documentos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Documentos de Inspeção
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="inspecao"
          onDocumentsChange={(docs) => handleInputChange('documentos', docs)}
          existingDocuments={formData.documentos || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
        />
      </div>

      {/* Upload de Fotos */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-1" />
          Fotografias da Inspeção
        </label>
        <DocumentUpload
          recordId={editingItem?.id || 'new'}
          recordType="inspecao"
          onDocumentsChange={(docs) => handleInputChange('fotos', docs)}
          existingDocuments={formData.fotos || []}
          maxFiles={10}
          maxSizeMB={5}
          allowedTypes={['.jpg', '.jpeg', '.png', '.gif']}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? 'Editar' : 'Adicionar'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderForm()}

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'A guardar...' : (editingItem ? 'Atualizar' : 'Guardar')}
          </button>
        </div>
      </form>
    </div>
  );
}
