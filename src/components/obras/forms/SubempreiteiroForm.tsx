import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Building, User, Phone, Mail, Calendar, DollarSign, Shield, Users, Plus, Trash2 } from 'lucide-react';
import { Subempreiteiro, SeguroSubempreiteiro, EquipaSubempreteiro } from '@/types';

interface SubempreiteiroFormProps {
  isOpen: boolean;
  onClose: () => void;
  subempreiteiro?: Subempreiteiro | null;
  onSave: (subempreiteiro: Subempreiteiro) => void;
}

export default function SubempreiteiroForm({ isOpen, onClose, subempreiteiro, onSave }: SubempreiteiroFormProps) {
  const [formData, setFormData] = useState<Partial<Subempreiteiro>>({
    nome: '',
    tipo_servico: '',
    telefone: '',
    email: '',
    endereco: '',
    nif: '',
    data_contratacao: '',
    data_fim_prevista: '',
    valor_contrato: 0,
    valor_executado: 0,
    percentual_execucao: 0,
    status: 'ativo',
    responsavel_contrato: '',
    observacoes: '',
    seguros: [],
    equipas: []
  });

  const [novoSeguro, setNovoSeguro] = useState<Partial<SeguroSubempreiteiro>>({
    tipo: '',
    seguradora: '',
    numero_poliza: '',
    data_inicio: '',
    data_fim: '',
    valor_cobertura: 0,
    status: 'ativo'
  });

  const [novaEquipa, setNovaEquipa] = useState<Partial<EquipaSubempreteiro>>({
    nome: '',
    responsavel: '',
    numero_elementos: 0,
    especialidade: '',
    status: 'ativa'
  });

  useEffect(() => {
    if (subempreiteiro) {
      setFormData({
        ...subempreiteiro,
        data_contratacao: subempreiteiro.data_contratacao ? new Date(subempreiteiro.data_contratacao).toISOString().split('T')[0] : '',
        data_fim_prevista: subempreiteiro.data_fim_prevista ? new Date(subempreiteiro.data_fim_prevista).toISOString().split('T')[0] : '',
        seguros: [...subempreiteiro.seguros],
        equipas: [...subempreiteiro.equipas]
      });
    } else {
      setFormData({
        nome: '',
        tipo_servico: '',
        telefone: '',
        email: '',
        endereco: '',
        nif: '',
        data_contratacao: '',
        data_fim_prevista: '',
        valor_contrato: 0,
        valor_executado: 0,
        percentual_execucao: 0,
        status: 'ativo',
        responsavel_contrato: '',
        observacoes: '',
        seguros: [],
        equipas: []
      });
    }
  }, [subempreiteiro]);

  const adicionarSeguro = () => {
    if (novoSeguro.tipo && novoSeguro.seguradora) {
      const seguro: SeguroSubempreiteiro = {
        id: `seguro_${Date.now()}`,
        tipo: novoSeguro.tipo,
        seguradora: novoSeguro.seguradora,
        numero_poliza: novoSeguro.numero_poliza || '',
        data_inicio: novoSeguro.data_inicio || new Date().toISOString(),
        data_fim: novoSeguro.data_fim || '',
        valor_cobertura: novoSeguro.valor_cobertura || 0,
        status: novoSeguro.status || 'ativo',
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      setFormData({
        ...formData,
        seguros: [...(formData.seguros || []), seguro]
      });

      setNovoSeguro({
        tipo: '',
        seguradora: '',
        numero_poliza: '',
        data_inicio: '',
        data_fim: '',
        valor_cobertura: 0,
        status: 'ativo'
      });
    }
  };

  const removerSeguro = (index: number) => {
    const seguros = [...(formData.seguros || [])];
    seguros.splice(index, 1);
    setFormData({ ...formData, seguros });
  };

  const adicionarEquipa = () => {
    if (novaEquipa.nome && novaEquipa.responsavel) {
      const equipa: EquipaSubempreteiro = {
        id: `equipa_${Date.now()}`,
        nome: novaEquipa.nome,
        responsavel: novaEquipa.responsavel,
        numero_elementos: novaEquipa.numero_elementos || 0,
        especialidade: novaEquipa.especialidade || '',
        status: novaEquipa.status || 'ativa',
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      setFormData({
        ...formData,
        equipas: [...(formData.equipas || []), equipa]
      });

      setNovaEquipa({
        nome: '',
        responsavel: '',
        numero_elementos: 0,
        especialidade: '',
        status: 'ativa'
      });
    }
  };

  const removerEquipa = (index: number) => {
    const equipas = [...(formData.equipas || [])];
    equipas.splice(index, 1);
    setFormData({ ...formData, equipas });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subempreiteiroData: Subempreiteiro = {
      id: subempreiteiro?.id || `subempreiteiro_${Date.now()}`,
      nome: formData.nome || '',
      tipo_servico: formData.tipo_servico || '',
      telefone: formData.telefone || '',
      email: formData.email || '',
      endereco: formData.endereco || '',
      nif: formData.nif || '',
      data_contratacao: formData.data_contratacao || new Date().toISOString(),
      data_fim_prevista: formData.data_fim_prevista || '',
      valor_contrato: formData.valor_contrato || 0,
      valor_executado: formData.valor_executado || 0,
      percentual_execucao: formData.percentual_execucao || 0,
      status: formData.status || 'ativo',
      responsavel_contrato: formData.responsavel_contrato || '',
      observacoes: formData.observacoes || '',
      seguros: formData.seguros || [],
      equipas: formData.equipas || [],
      data_criacao: subempreiteiro?.data_criacao || new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    onSave(subempreiteiroData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {subempreiteiro ? 'Editar Subempreiteiro' : 'Novo Subempreiteiro'}
              </h2>
              <p className="text-gray-600">Defina os detalhes do subempreiteiro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Nome da empresa"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 inline mr-2" />
                Tipo de Serviço *
              </label>
              <select
                required
                value={formData.tipo_servico}
                onChange={(e) => setFormData({ ...formData, tipo_servico: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecione o tipo de serviço</option>
                <option value="fundacoes">Fundações</option>
                <option value="estruturas">Estruturas</option>
                <option value="acabamentos">Acabamentos</option>
                <option value="instalacoes">Instalações</option>
                <option value="pavimentos">Pavimentos</option>
                <option value="coberturas">Coberturas</option>
                <option value="pinturas">Pinturas</option>
                <option value="jardinagem">Jardinagem</option>
                <option value="limpeza">Limpeza</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Telefone
              </label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Telefone"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIF
              </label>
              <input
                type="text"
                value={formData.nif}
                onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="NIF"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Endereço completo"
            />
          </div>

          {/* Datas do Contrato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Data de Contratação *
              </label>
              <input
                type="date"
                required
                value={formData.data_contratacao}
                onChange={(e) => setFormData({ ...formData, data_contratacao: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Data de Fim Prevista
              </label>
              <input
                type="date"
                value={formData.data_fim_prevista}
                onChange={(e) => setFormData({ ...formData, data_fim_prevista: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Valores e Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Valor do Contrato (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.valor_contrato}
                onChange={(e) => setFormData({ ...formData, valor_contrato: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Valor Executado (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.valor_executado}
                onChange={(e) => setFormData({ ...formData, valor_executado: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentual de Execução (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.percentual_execucao}
                onChange={(e) => setFormData({ ...formData, percentual_execucao: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="concluido">Concluído</option>
                <option value="rescisao">Rescisão</option>
              </select>
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Responsável pelo Contrato
            </label>
            <input
              type="text"
              value={formData.responsavel_contrato}
              onChange={(e) => setFormData({ ...formData, responsavel_contrato: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Nome do responsável"
            />
          </div>

          {/* Seguros */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Seguros
              </h3>
              <button
                type="button"
                onClick={adicionarSeguro}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Seguro
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.seguros?.map((seguro, index) => (
                <div key={seguro.id} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <span><strong>Tipo:</strong> {seguro.tipo}</span>
                      <span><strong>Seguradora:</strong> {seguro.seguradora}</span>
                      <span><strong>Poliza:</strong> {seguro.numero_poliza}</span>
                      <span><strong>Status:</strong> {seguro.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removerSeguro(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Equipas */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Equipas
              </h3>
              <button
                type="button"
                onClick={adicionarEquipa}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Equipa
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.equipas?.map((equipa, index) => (
                <div key={equipa.id} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <span><strong>Nome:</strong> {equipa.nome}</span>
                      <span><strong>Responsável:</strong> {equipa.responsavel}</span>
                      <span><strong>Elementos:</strong> {equipa.numero_elementos}</span>
                      <span><strong>Status:</strong> {equipa.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removerEquipa(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-colors font-medium"
            >
              {subempreiteiro ? 'Atualizar' : 'Criar'} Subempreiteiro
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
