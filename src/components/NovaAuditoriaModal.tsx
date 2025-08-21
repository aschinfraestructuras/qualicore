import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Save, 
  Calendar, 
  User, 
  Building, 
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  FileText,
  Target
} from 'lucide-react';

interface NovaAuditoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AuditoriaForm {
  tipo: 'INTERNA' | 'EXTERNA' | 'CERTIFICACAO' | 'MANUTENCAO';
  data_auditoria: string;
  auditor: string;
  organismo: string;
  escopo: string;
  observacoes: string;
}

const TIPOS_AUDITORIA = [
  { value: 'INTERNA', label: 'Auditoria Interna', desc: 'Auditoria realizada pela própria organização' },
  { value: 'EXTERNA', label: 'Auditoria Externa', desc: 'Auditoria realizada por entidade externa' },
  { value: 'CERTIFICACAO', label: 'Auditoria de Certificação', desc: 'Auditoria para obtenção de certificação' },
  { value: 'MANUTENCAO', label: 'Auditoria de Manutenção', desc: 'Auditoria para manter certificação existente' }
];

const ORGANISMOS_AUDITORIA = [
  'IPQ - Instituto Português da Qualidade',
  'ENAC - Entidad Nacional de Acreditación',
  'UKAS - United Kingdom Accreditation Service',
  'DAkkS - Deutsche Akkreditierungsstelle',
  'COFRAC - Comité français d\'accréditation',
  'SINAL - Sistema Nacional de Acreditação',
  'CETEST - Centro de Ensaios e Tecnologia',
  'Auditoria Interna',
  'Outro'
];

export default function NovaAuditoriaModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: NovaAuditoriaModalProps) {
  const [form, setForm] = useState<AuditoriaForm>({
    tipo: 'INTERNA',
    data_auditoria: '',
    auditor: '',
    organismo: '',
    escopo: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AuditoriaForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AuditoriaForm> = {};

    if (!form.data_auditoria) {
      newErrors.data_auditoria = 'Data da auditoria é obrigatória';
    }
    if (!form.auditor) {
      newErrors.auditor = 'Auditor é obrigatório';
    }
    if (form.tipo !== 'INTERNA' && !form.organismo) {
      newErrors.organismo = 'Organismo é obrigatório para auditorias externas';
    }
    if (!form.escopo) {
      newErrors.escopo = 'Escopo é obrigatório';
    }

    // Validar data futura
    if (form.data_auditoria) {
      const dataAuditoria = new Date(form.data_auditoria);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataAuditoria < hoje) {
        newErrors.data_auditoria = 'Data da auditoria deve ser hoje ou futura';
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
      // Simular criação da auditoria
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Auditoria agendada com sucesso!');
      onSuccess();
      onClose();
      
      // Reset form
      setForm({
        tipo: 'INTERNA',
        data_auditoria: '',
        auditor: '',
        organismo: '',
        escopo: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao agendar auditoria:', error);
      toast.error('Erro ao agendar auditoria');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuditoriaForm, value: string) => {
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
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nova Auditoria
            </h2>
            <p className="text-sm text-gray-500">
              Agendar nova auditoria de qualidade
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* Tipo de Auditoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Auditoria *
            </label>
            <select
              value={form.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value as AuditoriaForm['tipo'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TIPOS_AUDITORIA.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {TIPOS_AUDITORIA.find(t => t.value === form.tipo)?.desc}
            </p>
          </div>

          {/* Data da Auditoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Auditoria *
            </label>
            <input
              type="date"
              value={form.data_auditoria}
              onChange={(e) => handleInputChange('data_auditoria', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.data_auditoria ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.data_auditoria && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.data_auditoria}
              </p>
            )}
          </div>

          {/* Auditor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auditor Responsável *
            </label>
            <input
              type="text"
              value={form.auditor}
              onChange={(e) => handleInputChange('auditor', e.target.value)}
              placeholder="Nome do auditor responsável"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.auditor ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.auditor && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.auditor}
              </p>
            )}
          </div>

          {/* Organismo (apenas para auditorias externas) */}
          {form.tipo !== 'INTERNA' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organismo Auditor *
              </label>
              <select
                value={form.organismo}
                onChange={(e) => handleInputChange('organismo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.organismo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o organismo</option>
                {ORGANISMOS_AUDITORIA.map((org) => (
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
          )}

          {/* Escopo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escopo da Auditoria *
            </label>
            <textarea
              value={form.escopo}
              onChange={(e) => handleInputChange('escopo', e.target.value)}
              placeholder="Descreva o escopo da auditoria..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Agendando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Agendar Auditoria</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
