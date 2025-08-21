import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  X, 
  Save, 
  Calendar, 
  FileText, 
  Building, 
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import { Equipamento } from '../types/calibracoes';

interface NovaCertificacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipamentos: Equipamento[];
  onSuccess: () => void;
}

interface CertificacaoForm {
  equipamento_id: string;
  tipo: 'ISO_17025' | 'ISO_9001' | 'IPQ' | 'CEN' | 'ENAC' | 'OUTRO';
  numero: string;
  organismo: string;
  data_emissao: string;
  data_validade: string;
  escopo: string;
  observacoes: string;
}

const TIPOS_CERTIFICACAO = [
  { value: 'ISO_17025', label: 'ISO/IEC 17025 - Laboratórios', desc: 'Requisitos gerais para a competência de laboratórios' },
  { value: 'ISO_9001', label: 'ISO 9001 - Gestão da Qualidade', desc: 'Sistemas de gestão da qualidade' },
  { value: 'IPQ', label: 'IPQ - Instituto Português da Qualidade', desc: 'Certificação nacional portuguesa' },
  { value: 'CEN', label: 'CEN - Comité Europeu de Normalização', desc: 'Normas europeias' },
  { value: 'ENAC', label: 'ENAC - Entidad Nacional de Acreditación', desc: 'Acreditação espanhola' },
  { value: 'OUTRO', label: 'Outro', desc: 'Outro tipo de certificação' }
];

const ORGANISMOS_CERTIFICACAO = [
  'IPQ - Instituto Português da Qualidade',
  'ENAC - Entidad Nacional de Acreditación',
  'UKAS - United Kingdom Accreditation Service',
  'DAkkS - Deutsche Akkreditierungsstelle',
  'COFRAC - Comité français d\'accréditation',
  'SINAL - Sistema Nacional de Acreditação',
  'CETEST - Centro de Ensaios e Tecnologia',
  'Outro'
];

export default function NovaCertificacaoModal({ 
  isOpen, 
  onClose, 
  equipamentos, 
  onSuccess 
}: NovaCertificacaoModalProps) {
  const [form, setForm] = useState<CertificacaoForm>({
    equipamento_id: '',
    tipo: 'ISO_17025',
    numero: '',
    organismo: '',
    data_emissao: '',
    data_validade: '',
    escopo: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CertificacaoForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CertificacaoForm> = {};

    if (!form.equipamento_id) {
      newErrors.equipamento_id = 'Equipamento é obrigatório';
    }
    if (!form.numero) {
      newErrors.numero = 'Número da certificação é obrigatório';
    }
    if (!form.organismo) {
      newErrors.organismo = 'Organismo certificador é obrigatório';
    }
    if (!form.data_emissao) {
      newErrors.data_emissao = 'Data de emissão é obrigatória';
    }
    if (!form.data_validade) {
      newErrors.data_validade = 'Data de validade é obrigatória';
    }
    if (!form.escopo) {
      newErrors.escopo = 'Escopo é obrigatório';
    }

    // Validar datas
    if (form.data_emissao && form.data_validade) {
      const dataEmissao = new Date(form.data_emissao);
      const dataValidade = new Date(form.data_validade);
      
      if (dataEmissao >= dataValidade) {
        newErrors.data_validade = 'Data de validade deve ser posterior à data de emissão';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      // Simular criação da certificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Certificação criada com sucesso!');
      onSuccess();
      onClose();
      
      // Reset form
      setForm({
        equipamento_id: '',
        tipo: 'ISO_17025',
        numero: '',
        organismo: '',
        data_emissao: '',
        data_validade: '',
        escopo: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao criar certificação:', error);
      toast.error('Erro ao criar certificação');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CertificacaoForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nova Certificação
            </h2>
            <p className="text-sm text-gray-500">
              Criar nova certificação para equipamento
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Equipamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipamento *
                </label>
                <select
                  value={form.equipamento_id}
                  onChange={(e) => handleInputChange('equipamento_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.equipamento_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um equipamento</option>
                  {equipamentos.map((equip) => (
                    <option key={equip.id} value={equip.id}>
                      {equip.codigo} - {equip.nome}
                    </option>
                  ))}
                </select>
                {errors.equipamento_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.equipamento_id}
                  </p>
                )}
              </div>

              {/* Tipo de Certificação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Certificação *
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value as CertificacaoForm['tipo'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {TIPOS_CERTIFICACAO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {TIPOS_CERTIFICACAO.find(t => t.value === form.tipo)?.desc}
                </p>
              </div>

              {/* Número da Certificação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número da Certificação *
                </label>
                <input
                  type="text"
                  value={form.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  placeholder="Ex: CERT-2024-001"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.numero ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.numero && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.numero}
                  </p>
                )}
              </div>

              {/* Organismo Certificador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organismo Certificador *
                </label>
                <select
                  value={form.organismo}
                  onChange={(e) => handleInputChange('organismo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.organismo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o organismo</option>
                  {ORGANISMOS_CERTIFICACAO.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
                {errors.organismo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.organismo}
                  </p>
                )}
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Emissão *
                  </label>
                  <input
                    type="date"
                    value={form.data_emissao}
                    onChange={(e) => handleInputChange('data_emissao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.data_emissao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.data_emissao && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.data_emissao}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Validade *
                  </label>
                  <input
                    type="date"
                    value={form.data_validade}
                    onChange={(e) => handleInputChange('data_validade', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.data_validade ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.data_validade && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.data_validade}
                    </p>
                  )}
                </div>
              </div>

              {/* Escopo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escopo da Certificação *
                </label>
                <textarea
                  value={form.escopo}
                  onChange={(e) => handleInputChange('escopo', e.target.value)}
                  placeholder="Descreva o escopo da certificação..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.escopo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.escopo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.escopo}
                  </p>
                )}
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={form.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Info className="w-4 h-4" />
            <span>Campos marcados com * são obrigatórios</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Criando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Criar Certificação</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
