import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Building2, 
  Star, 
  Award, 
  Shield, 
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FornecedorAvancado } from '../types/fornecedores';

interface FornecedoresAvancadosFormsProps {
  fornecedor?: FornecedorAvancado | null;
  onClose: () => void;
  onSave: (fornecedor: Partial<FornecedorAvancado>) => void;
}

export function FornecedoresAvancadosForms({
  fornecedor,
  onClose,
  onSave
}: FornecedoresAvancadosFormsProps) {
  const [formData, setFormData] = useState<Partial<FornecedorAvancado>>({
    codigo: '',
    nome: '',
    nif: '',
    morada: '',
    codigo_postal: '',
    cidade: '',
    pais: 'Portugal',
    telefone: '',
    email: '',
    website: '',
    contacto_principal: '',
    cargo_contacto: '',
    status_qualificacao: 'pendente',
    data_qualificacao: '',
    data_reavaliacao: '',
    criterios_qualificacao: [],
    documentos_qualificacao: [],
    classificacao_geral: 0,
    criterios_avaliacao: {
      qualidade: 0,
      prazo_entrega: 0,
      preco: 0,
      comunicacao: 0,
      flexibilidade: 0,
      inovacao: 0
    },
    historico_avaliacoes: [],
    certificacoes: [],
    categorias: [],
    produtos_principais: [],
    limite_credito: 0,
    condicoes_pagamento: '',
    historico_pagamentos: [],
    seguro_responsabilidade: false,
    certificado_seguranca: '',
    politica_qualidade: '',
    ultima_auditoria: '',
    proxima_auditoria: '',
    status_monitorizacao: 'ativo',
    observacoes: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [newCategoria, setNewCategoria] = useState('');
  const [newProduto, setNewProduto] = useState('');

  useEffect(() => {
    if (fornecedor) {
      setFormData({
        ...fornecedor,
        data_qualificacao: fornecedor.data_qualificacao ? new Date(fornecedor.data_qualificacao).toISOString().split('T')[0] : '',
        data_reavaliacao: fornecedor.data_reavaliacao ? new Date(fornecedor.data_reavaliacao).toISOString().split('T')[0] : '',
        ultima_auditoria: fornecedor.ultima_auditoria ? new Date(fornecedor.ultima_auditoria).toISOString().split('T')[0] : '',
        proxima_auditoria: fornecedor.proxima_auditoria ? new Date(fornecedor.proxima_auditoria).toISOString().split('T')[0] : ''
      });
    }
  }, [fornecedor]);

  const handleInputChange = (field: keyof FornecedorAvancado, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCriterioChange = (criterio: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      criterios_avaliacao: {
        ...prev.criterios_avaliacao!,
        [criterio]: value
      }
    }));
  };

  const addToArray = (field: keyof FornecedorAvancado, value: string) => {
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

  const removeFromArray = (field: keyof FornecedorAvancado, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.codigo) {
      toast.error('Nome e código são obrigatórios');
      return;
    }

    // Calcular classificação geral
    const criterios = formData.criterios_avaliacao!;
    const media = Object.values(criterios).reduce((acc, val) => acc + val, 0) / Object.keys(criterios).length;
    
    const fornecedorData = {
      ...formData,
      classificacao_geral: media,
      data_criacao: fornecedor ? fornecedor.data_criacao : new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    onSave(fornecedorData);
  };

  const calcularClassificacao = () => {
    const criterios = formData.criterios_avaliacao!;
    return Object.values(criterios).reduce((acc, val) => acc + val, 0) / Object.keys(criterios).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-6 w-6 mr-2 text-blue-600" />
              {fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Informações Básicas */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIF</label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Endereço
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Morada</label>
                <input
                  type="text"
                  value={formData.morada}
                  onChange={(e) => handleInputChange('morada', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                <input
                  type="text"
                  value={formData.codigo_postal}
                  onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <input
                  type="text"
                  value={formData.pais}
                  onChange={(e) => handleInputChange('pais', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Qualificação */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-purple-600" />
              Qualificação
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status_qualificacao}
                  onChange={(e) => handleInputChange('status_qualificacao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pendente">Pendente</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="suspenso">Suspenso</option>
                  <option value="desqualificado">Desqualificado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Qualificação</label>
                <input
                  type="date"
                  value={formData.data_qualificacao}
                  onChange={(e) => handleInputChange('data_qualificacao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Reavaliação</label>
                <input
                  type="date"
                  value={formData.data_reavaliacao}
                  onChange={(e) => handleInputChange('data_reavaliacao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Monitorização</label>
                <select
                  value={formData.status_monitorizacao}
                  onChange={(e) => handleInputChange('status_monitorizacao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
              </div>
            </div>
          </div>

          {/* Avaliação */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Avaliação de Performance
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualidade (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.criterios_avaliacao?.qualidade || 0}
                  onChange={(e) => handleCriterioChange('qualidade', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prazo Entrega (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.criterios_avaliacao?.prazo_entrega || 0}
                  onChange={(e) => handleCriterioChange('prazo_entrega', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.criterios_avaliacao?.preco || 0}
                  onChange={(e) => handleCriterioChange('preco', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comunicação (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.criterios_avaliacao?.comunicacao || 0}
                  onChange={(e) => handleCriterioChange('comunicacao', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flexibilidade (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.criterios_avaliacao?.flexibilidade || 0}
                  onChange={(e) => handleCriterioChange('flexibilidade', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inovação (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.criterios_avaliacao?.inovacao || 0}
                  onChange={(e) => handleCriterioChange('inovacao', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Classificação Geral:</span>
                <span className="text-lg font-bold text-blue-600">{calcularClassificacao().toFixed(1)} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Categorias e Produtos */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-orange-600" />
              Categorias e Produtos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                    placeholder="Nova categoria..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray('categorias', newCategoria);
                      setNewCategoria('');
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.categorias?.map((categoria, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {categoria}
                      <button
                        type="button"
                        onClick={() => removeFromArray('categorias', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produtos Principais</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newProduto}
                    onChange={(e) => setNewProduto(e.target.value)}
                    placeholder="Novo produto..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray('produtos_principais', newProduto);
                      setNewProduto('');
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.produtos_principais?.map((produto, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {produto}
                      <button
                        type="button"
                        onClick={() => removeFromArray('produtos_principais', index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Observações
            </h3>
            
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais sobre o fornecedor..."
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {fornecedor ? 'Atualizar' : 'Criar'} Fornecedor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
