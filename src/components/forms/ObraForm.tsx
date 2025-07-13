import { Ensaio, Documento, Checklist, Material, Fornecedor, NaoConformidade, Obra, ZonaObra } from '../../types'
import { useState } from 'react'
import { Plus, X, Building, MapPin, Calendar, Users, BarChart3 } from 'lucide-react'

interface ObraFormProps {
  initialData?: Partial<Obra>
  onCancel: () => void
  onSubmit: (data: Obra) => void
}

export default function ObraForm({ initialData, onCancel, onSubmit }: ObraFormProps) {
  const [formData, setFormData] = useState<Partial<Obra>>({
    codigo: initialData?.codigo || '',
    nome: initialData?.nome || '',
    cliente: initialData?.cliente || '',
    localizacao: initialData?.localizacao || '',
    data_inicio: initialData?.data_inicio || '',
    data_fim_prevista: initialData?.data_fim_prevista || '',
    valor_contrato: initialData?.valor_contrato || 0,
    valor_executado: initialData?.valor_executado || 0,
    percentual_execucao: initialData?.percentual_execucao || 0,
    status: initialData?.status || 'planeamento',
    tipo_obra: initialData?.tipo_obra || 'residencial',
    categoria: initialData?.categoria || 'media',
    responsavel_tecnico: initialData?.responsavel_tecnico || '',
    coordenador_obra: initialData?.coordenador_obra || '',
    fiscal_obra: initialData?.fiscal_obra || '',
    engenheiro_responsavel: initialData?.engenheiro_responsavel || '',
    arquiteto: initialData?.arquiteto || '',
    zonas: initialData?.zonas || [],
    fases: initialData?.fases || [],
    equipas: initialData?.equipas || [],
    fornecedores_principais: initialData?.fornecedores_principais || [],
    riscos: initialData?.riscos || [],
    indicadores: initialData?.indicadores || [],
    observacoes: initialData?.observacoes || ''
  })

  // Adicionar zona
  const addZona = () => {
    const novaZona: ZonaObra = {
      id: Date.now().toString(),
      nome: '',
      descricao: '',
      area: 0,
      unidade_area: 'm2',
      percentual_execucao: 0,
      data_inicio: '',
      data_fim_prevista: '',
      status: 'nao_iniciada',
      responsavel: '',
      materiais_utilizados: [],
      ensaios_realizados: [],
      checklists_executados: [],
      nao_conformidades: []
    }

    setFormData(prev => ({
      ...prev,
      zonas: [...(prev.zonas || []), novaZona]
    }))
  }

  // Remover zona
  const removeZona = (index: number) => {
    setFormData(prev => ({
      ...prev,
      zonas: (prev.zonas || []).filter((_, i) => i !== index)
    }))
  }

  // Atualizar zona
  const updateZona = (index: number, field: keyof ZonaObra, value: any) => {
    setFormData(prev => ({
      ...prev,
      zonas: (prev.zonas || []).map((z, i) =>
        i === index ? { ...z, [field]: value } : z
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      zonas: formData.zonas || [],
      fases: formData.fases || [],
      equipas: formData.equipas || [],
      fornecedores_principais: formData.fornecedores_principais || [],
      riscos: formData.riscos || [],
      indicadores: formData.indicadores || []
    } as Obra)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Informações Básicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código da Obra *</label>
            <input
              type="text"
              value={formData.codigo}
              onChange={e => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Obra *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            <input
              type="text"
              value={formData.cliente}
              onChange={e => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localização *</label>
            <input
              type="text"
              value={formData.localizacao}
              onChange={e => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Datas e Valores */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Datas e Valores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
            <input
              type="date"
              value={formData.data_inicio}
              onChange={e => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim Prevista *</label>
            <input
              type="date"
              value={formData.data_fim_prevista}
              onChange={e => setFormData(prev => ({ ...prev, data_fim_prevista: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Contrato (€) *</label>
            <input
              type="number"
              value={formData.valor_contrato}
              onChange={e => setFormData(prev => ({ ...prev, valor_contrato: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor Executado (€)</label>
            <input
              type="number"
              value={formData.valor_executado}
              onChange={e => setFormData(prev => ({ ...prev, valor_executado: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Classificação */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Classificação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="planeamento">Planeamento</option>
              <option value="em_execucao">Em Execução</option>
              <option value="paralisada">Paralisada</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Obra *</label>
            <select
              value={formData.tipo_obra}
              onChange={e => setFormData(prev => ({ ...prev, tipo_obra: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="industrial">Industrial</option>
              <option value="infraestrutura">Infraestrutura</option>
              <option value="reabilitacao">Reabilitação</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
            <select
              value={formData.categoria}
              onChange={e => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pequena">Pequena</option>
              <option value="media">Média</option>
              <option value="grande">Grande</option>
              <option value="mega">Mega</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipa de Projeto */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Equipa de Projeto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsável Técnico *</label>
            <input
              type="text"
              value={formData.responsavel_tecnico}
              onChange={e => setFormData(prev => ({ ...prev, responsavel_tecnico: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coordenador da Obra *</label>
            <input
              type="text"
              value={formData.coordenador_obra}
              onChange={e => setFormData(prev => ({ ...prev, coordenador_obra: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal da Obra</label>
            <input
              type="text"
              value={formData.fiscal_obra}
              onChange={e => setFormData(prev => ({ ...prev, fiscal_obra: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Engenheiro Responsável</label>
            <input
              type="text"
              value={formData.engenheiro_responsavel}
              onChange={e => setFormData(prev => ({ ...prev, engenheiro_responsavel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arquiteto</label>
            <input
              type="text"
              value={formData.arquiteto}
              onChange={e => setFormData(prev => ({ ...prev, arquiteto: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Zonas da Obra */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Zonas da Obra
          </h3>
          <button
            type="button"
            onClick={addZona}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Zona
          </button>
        </div>
        <div className="space-y-4">
          {(formData.zonas || []).map((zona, idx) => (
            <div key={zona.id} className="border border-indigo-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-indigo-900">Zona {idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeZona(idx)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={zona.nome}
                  onChange={e => updateZona(idx, 'nome', e.target.value)}
                  placeholder="Nome da zona"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={zona.area}
                  onChange={e => updateZona(idx, 'area', parseFloat(e.target.value) || 0)}
                  placeholder="Área"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={zona.unidade_area}
                  onChange={e => updateZona(idx, 'unidade_area', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="m2">m²</option>
                  <option value="m3">m³</option>
                  <option value="un">Unidades</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
        <textarea
          value={formData.observacoes}
          onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Guardar Obra
        </button>
      </div>
    </form>
  )
} 