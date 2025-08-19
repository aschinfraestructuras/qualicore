import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  CheckSquare, 
  AlertTriangle,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Auditoria, CriterioAuditoria } from '../../types/auditorias';
import { auditoriasAPI } from '../../lib/supabase-api/auditoriasAPI';
import { v4 as uuidv4 } from 'uuid';

interface AuditoriaFormProps {
  auditoria?: Auditoria | null;
  onSave: (auditoria: Auditoria) => void;
  onCancel: () => void;
}

export default function AuditoriaForm({ auditoria, onSave, onCancel }: AuditoriaFormProps) {
  const [formData, setFormData] = useState<Partial<Auditoria>>({
    codigo: '',
    tipo: 'interna',
    escopo: '',
    data_inicio: '',
    data_fim: '',
    duracao_horas: 8,
    local: '',
    obra_id: '',
    obra_nome: '',
    auditor_principal: '',
    auditores: [],
    observadores: [],
    status: 'programada',
    resultado: 'pendente',
    classificacao: 'satisfatorio',
    normas_aplicaveis: [],
    responsavel: '',
    zona: '',
    observacoes: ''
  });

  const [criterios, setCriterios] = useState<CriterioAuditoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');

  useEffect(() => {
    if (auditoria) {
      setFormData(auditoria);
      setCriterios(auditoria.criterios_auditoria || []);
    } else {
      // Gerar código automático para nova auditoria
      const codigo = `AUD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, codigo }));
    }
  }, [auditoria]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const addCriterio = () => {
    const novoCriterio: CriterioAuditoria = {
      id: uuidv4(),
      codigo: `CR-${criterios.length + 1}`,
      descricao: '',
      categoria: 'documentacao',
      peso: 1,
      pontuacao_maxima: 10,
      pontuacao_atual: 0,
      conformidade: 'nao_aplicavel'
    };
    setCriterios([...criterios, novoCriterio]);
  };

  const updateCriterio = (index: number, field: string, value: any) => {
    const updatedCriterios = [...criterios];
    updatedCriterios[index] = { ...updatedCriterios[index], [field]: value };
    setCriterios(updatedCriterios);
  };

  const removeCriterio = (index: number) => {
    setCriterios(criterios.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auditoriaData = {
        ...formData,
        criterios_auditoria: criterios,
        data_criacao: auditoria?.data_criacao || new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      let savedAuditoria;
      if (auditoria?.id) {
        savedAuditoria = await auditoriasAPI.updateAuditoria(auditoria.id, auditoriaData);
      } else {
        savedAuditoria = await auditoriasAPI.createAuditoria(auditoriaData);
      }

      toast.success(auditoria ? 'Auditoria atualizada com sucesso!' : 'Auditoria criada com sucesso!');
      onSave(savedAuditoria);
    } catch (error) {
      console.error('Erro ao salvar auditoria:', error);
      toast.error('Erro ao salvar auditoria');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Shield },
    { id: 'equipa', label: 'Equipa', icon: Users },
    { id: 'criterios', label: 'Critérios', icon: CheckSquare },
    { id: 'documentos', label: 'Documentos', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {auditoria ? 'Editar Auditoria' : 'Nova Auditoria'}
                </h2>
                <p className="text-blue-100">
                  {auditoria ? 'Modificar dados da auditoria' : 'Criar nova auditoria SGQ'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6 space-y-6">
            
            {/* Tab Geral */}
            {activeTab === 'geral' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código da Auditoria
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Auditoria
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="interna">Interna</option>
                    <option value="externa">Externa</option>
                    <option value="certificacao">Certificação</option>
                    <option value="seguimento">Seguimento</option>
                    <option value="surpresa">Surpresa</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escopo
                  </label>
                  <textarea
                    value={formData.escopo}
                    onChange={(e) => handleInputChange('escopo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva o escopo da auditoria..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.data_inicio}
                    onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Fim
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.data_fim}
                    onChange={(e) => handleInputChange('data_fim', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração (horas)
                  </label>
                  <input
                    type="number"
                    value={formData.duracao_horas}
                    onChange={(e) => handleInputChange('duracao_horas', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local
                  </label>
                  <input
                    type="text"
                    value={formData.local}
                    onChange={(e) => handleInputChange('local', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Local da auditoria"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obra
                  </label>
                  <input
                    type="text"
                    value={formData.obra_nome}
                    onChange={(e) => handleInputChange('obra_nome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome da obra"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.responsavel}
                    onChange={(e) => handleInputChange('responsavel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do responsável"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona
                  </label>
                  <input
                    type="text"
                    value={formData.zona}
                    onChange={(e) => handleInputChange('zona', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Zona geográfica"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Observações adicionais..."
                  />
                </div>
              </motion.div>
            )}

            {/* Tab Equipa */}
            {activeTab === 'equipa' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auditor Principal
                  </label>
                  <input
                    type="text"
                    value={formData.auditor_principal}
                    onChange={(e) => handleInputChange('auditor_principal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do auditor principal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auditores
                  </label>
                  <div className="space-y-2">
                    {formData.auditores?.map((auditor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={auditor}
                          onChange={(e) => {
                            const newAuditores = [...(formData.auditores || [])];
                            newAuditores[index] = e.target.value;
                            handleInputChange('auditores', newAuditores);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do auditor"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('auditores', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Adicionar auditor"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayChange('auditores', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleArrayChange('auditores', input.value);
                          input.value = '';
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observadores
                  </label>
                  <div className="space-y-2">
                    {formData.observadores?.map((observador, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={observador}
                          onChange={(e) => {
                            const newObservadores = [...(formData.observadores || [])];
                            newObservadores[index] = e.target.value;
                            handleInputChange('observadores', newObservadores);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do observador"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('observadores', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Adicionar observador"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayChange('observadores', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleArrayChange('observadores', input.value);
                          input.value = '';
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab Critérios */}
            {activeTab === 'criterios' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Critérios de Auditoria</h3>
                  <button
                    type="button"
                    onClick={addCriterio}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Critério</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {criterios.map((criterio, index) => (
                    <div key={criterio.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código
                          </label>
                          <input
                            type="text"
                            value={criterio.codigo}
                            onChange={(e) => updateCriterio(index, 'codigo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                          </label>
                          <select
                            value={criterio.categoria}
                            onChange={(e) => updateCriterio(index, 'categoria', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="documentacao">Documentação</option>
                            <option value="processos">Processos</option>
                            <option value="recursos">Recursos</option>
                            <option value="resultados">Resultados</option>
                            <option value="melhoria">Melhoria</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso
                          </label>
                          <input
                            type="number"
                            value={criterio.peso}
                            onChange={(e) => updateCriterio(index, 'peso', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pontuação Máxima
                          </label>
                          <input
                            type="number"
                            value={criterio.pontuacao_maxima}
                            onChange={(e) => updateCriterio(index, 'pontuacao_maxima', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição
                        </label>
                        <textarea
                          value={criterio.descricao}
                          onChange={(e) => updateCriterio(index, 'descricao', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Descrição do critério..."
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Conformidade
                            </label>
                            <select
                              value={criterio.conformidade}
                              onChange={(e) => updateCriterio(index, 'conformidade', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="nao_aplicavel">Não Aplicável</option>
                              <option value="conforme">Conforme</option>
                              <option value="nao_conforme">Não Conforme</option>
                              <option value="parcialmente_conforme">Parcialmente Conforme</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCriterio(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab Documentos */}
            {activeTab === 'documentos' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Normas Aplicáveis
                  </label>
                  <div className="space-y-2">
                    {formData.normas_aplicaveis?.map((norma, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={norma}
                          onChange={(e) => {
                            const newNormas = [...(formData.normas_aplicaveis || [])];
                            newNormas[index] = e.target.value;
                            handleInputChange('normas_aplicaveis', newNormas);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: ISO 9001:2015"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('normas_aplicaveis', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Adicionar norma"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayChange('normas_aplicaveis', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleArrayChange('normas_aplicaveis', input.value);
                          input.value = '';
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Upload de Documentos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Arraste e solte documentos aqui ou clique para selecionar
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Selecionar Ficheiros
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? 'A guardar...' : 'Guardar Auditoria'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
