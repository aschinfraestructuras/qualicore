import { Material } from '@/types'
import { useState, useEffect, useMemo } from 'react'
import { 
  Plus, 
  Package, 
  CheckCircle, 
  Edit, 
  Trash2, 
  X, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Eye,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import MaterialForm from '@/components/forms/MaterialForm'
import MaterialView from '@/components/MaterialView'
import { materiaisAPI } from '@/lib/supabase-api'
import { sanitizeUUIDField } from '@/utils/uuid'

interface Filtros {
  search: string
  tipo: string
  estado: string
  zona: string
  fornecedor: string
  dataInicio: string
  dataFim: string
}

export default function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filtros, setFiltros] = useState<Filtros>({
    search: '',
    tipo: '',
    estado: '',
    zona: '',
    fornecedor: '',
    dataInicio: '',
    dataFim: ''
  })

  useEffect(() => {
    loadMateriais()
  }, [])

  const loadMateriais = async () => {
    try {
      setLoading(true)
      const data = await materiaisAPI.getAll()
      setMateriais(data || [])
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
      toast.error('Erro ao carregar materiais')
      setMateriais([])
    } finally {
      setLoading(false)
    }
  }

  // Filtros e pesquisa
  const materiaisFiltrados = useMemo(() => {
    return materiais.filter(material => {
      const matchSearch = !filtros.search || 
        material.codigo.toLowerCase().includes(filtros.search.toLowerCase()) ||
        material.nome.toLowerCase().includes(filtros.search.toLowerCase()) ||
        material.lote.toLowerCase().includes(filtros.search.toLowerCase())
      
      const matchTipo = !filtros.tipo || material.tipo === filtros.tipo
      const matchEstado = !filtros.estado || material.estado === filtros.estado
      const matchZona = !filtros.zona || material.zona === filtros.zona
      const matchFornecedor = !filtros.fornecedor || material.fornecedor_id === filtros.fornecedor
      
      const matchData = !filtros.dataInicio || !filtros.dataFim || 
        (material.data_rececao >= filtros.dataInicio && material.data_rececao <= filtros.dataFim)
      
      return matchSearch && matchTipo && matchEstado && matchZona && matchFornecedor && matchData
    })
  }, [materiais, filtros])

  // Estatísticas
  const stats = useMemo(() => {
    const total = materiais.length
    const aprovados = materiais.filter(m => m.estado === 'aprovado').length
    const pendentes = materiais.filter(m => m.estado === 'pendente').length
    const emAnalise = materiais.filter(m => m.estado === 'em_analise').length
    const reprovados = materiais.filter(m => m.estado === 'reprovado').length
    const concluidos = materiais.filter(m => m.estado === 'concluido').length
    
    const totalQuantidade = materiais.reduce((sum, m) => sum + m.quantidade, 0)
    const valorEstimado = totalQuantidade * 150 // Valor estimado por unidade
    
    return {
      total,
      aprovados,
      pendentes,
      emAnalise,
      reprovados,
      concluidos,
      totalQuantidade,
      valorEstimado
    }
  }, [materiais])

  const handleCreate = () => {
    setEditingMaterial(null)
    setShowForm(true)
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setShowForm(true)
  }

  const handleView = (material: Material) => {
    setViewingMaterial(material)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      // Sanitizar campos UUID
      const payload = {
        ...data,
        fornecedor_id: sanitizeUUIDField(data.fornecedor_id),
        certificado_id: sanitizeUUIDField(data.certificado_id)
      }
      if (editingMaterial) {
        await materiaisAPI.update(editingMaterial.id, payload)
        toast.success('Material atualizado com sucesso!')
      } else {
        await materiaisAPI.create(payload)
        toast.success('Material criado com sucesso!')
      }
      await loadMateriais()
      setShowForm(false)
    } catch (error) {
      toast.error('Erro ao salvar material')
      console.error('Erro ao salvar material:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este material?')) {
      try {
        await materiaisAPI.delete(id)
        toast.success('Material eliminado com sucesso!')
        await loadMateriais()
      } catch (error) {
        toast.error('Erro ao eliminar material')
        console.error('Erro ao eliminar material:', error)
      }
    }
  }

  const handleExport = () => {
    const csvContent = generateCSV(materiaisFiltrados)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `materiais_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Relatório exportado com sucesso!')
  }

  const handlePrint = () => {
    const printContent = generatePrintContent(materiaisFiltrados)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
    toast.success('Relatório enviado para impressão!')
  }

  const generateCSV = (materiais: Material[]) => {
    const headers = ['Código', 'Nome', 'Tipo', 'Fornecedor', 'Data Receção', 'Quantidade', 'Unidade', 'Lote', 'Estado', 'Zona', 'Responsável']
    const rows = materiais.map(m => [
      m.codigo,
      m.nome,
      m.tipo,
      m.fornecedor_id,
      m.data_rececao,
      m.quantidade,
      m.unidade,
      m.lote,
      m.estado,
      m.zona,
      m.responsavel
    ])
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }

  const generatePrintContent = (materiais: Material[]) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Materiais</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stat { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Materiais</h1>
            <p>Data: ${new Date().toLocaleDateString('pt-PT')}</p>
            <p>Total: ${materiais.length} materiais</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <h3>Aprovados</h3>
              <p>${stats.aprovados}</p>
            </div>
            <div class="stat">
              <h3>Pendentes</h3>
              <p>${stats.pendentes}</p>
            </div>
            <div class="stat">
              <h3>Em Análise</h3>
              <p>${stats.emAnalise}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Estado</th>
                <th>Zona</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              ${materiais.map(m => `
                <tr>
                  <td>${m.codigo}</td>
                  <td>${m.nome}</td>
                  <td>${m.tipo}</td>
                  <td>${m.quantidade} ${m.unidade}</td>
                  <td>${m.estado}</td>
                  <td>${m.zona}</td>
                  <td>${m.responsavel}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
  }

  const clearFilters = () => {
    setFiltros({
      search: '',
      tipo: '',
      estado: '',
      zona: '',
      fornecedor: '',
      dataInicio: '',
      dataFim: ''
    })
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprovado': return 'text-green-600 bg-green-100'
      case 'pendente': return 'text-yellow-600 bg-yellow-100'
      case 'em_analise': return 'text-blue-600 bg-blue-100'
      case 'reprovado': return 'text-red-600 bg-red-100'
      case 'concluido': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'betao': return <Package className="h-5 w-5 text-gray-600" />
      case 'aco': return <Package className="h-5 w-5 text-blue-600" />
      case 'agregado': return <Package className="h-5 w-5 text-yellow-600" />
      case 'cimento': return <Package className="h-5 w-5 text-gray-800" />
      default: return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Materiais</h1>
          <p className="text-gray-600">Controlo de materiais e stocks</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="btn btn-outline btn-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <button 
            className="btn btn-outline btn-md"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button 
            className="btn btn-outline btn-md"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </button>
          <button 
            className="btn btn-primary btn-md"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Material
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Filtros</h3>
            <button 
              className="btn btn-outline btn-sm"
              onClick={clearFilters}
            >
              Limpar Filtros
            </button>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesquisar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Código, nome, lote..."
                    value={filtros.search}
                    onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                    className="input pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                  className="select"
                >
                  <option value="">Todos os tipos</option>
                  <option value="betao">Betão</option>
                  <option value="aco">Aço</option>
                  <option value="agregado">Agregado</option>
                  <option value="cimento">Cimento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                  className="select"
                >
                  <option value="">Todos os estados</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_analise">Em Análise</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona
                </label>
                <select
                  value={filtros.zona}
                  onChange={(e) => setFiltros(prev => ({ ...prev, zona: e.target.value }))}
                  className="select"
                >
                  <option value="">Todas as zonas</option>
                  <option value="Zona A - Fundações">Zona A - Fundações</option>
                  <option value="Zona B - Pilares">Zona B - Pilares</option>
                  <option value="Zona C - Lajes">Zona C - Lajes</option>
                  <option value="Zona D - Estrutura">Zona D - Estrutura</option>
                  <option value="Armazém Central">Armazém Central</option>
                  <option value="Laboratório">Laboratório</option>
                  <option value="Escritório">Escritório</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">{stats.totalQuantidade} unidades</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{stats.aprovados}</p>
                <p className="text-xs text-gray-500">
                  {stats.total > 0 ? ((stats.aprovados / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                <p className="text-xs text-gray-500">
                  {stats.total > 0 ? ((stats.pendentes / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-blue-600">{stats.emAnalise}</p>
                <p className="text-xs text-gray-500">
                  {stats.total > 0 ? ((stats.emAnalise / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Materiais */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Materiais</h3>
          <p className="card-description">
            {materiaisFiltrados.length} de {materiais.length} material(is) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {materiaisFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {materiais.length === 0 ? 'Nenhum material encontrado' : 'Nenhum material corresponde aos filtros aplicados'}
              </p>
              {materiais.length === 0 && (
                <button 
                  className="btn btn-primary btn-sm mt-4"
                  onClick={handleCreate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Material
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {materiaisFiltrados.map((material) => (
                <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        {getTipoIcon(material.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{material.codigo}</h4>
                          <span className={`badge ${getEstadoColor(material.estado)}`}>
                            {material.estado.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {material.nome} - {material.tipo}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(material.data_rececao).toLocaleDateString('pt-PT')}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {material.zona}
                          </span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {material.responsavel}
                          </span>
                          <span className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            {material.quantidade} {material.unidade}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleView(material)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(material)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(material.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMaterial ? 'Editar Material' : 'Novo Material'}
              </h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <MaterialForm 
                initialData={editingMaterial ? {
                  codigo: editingMaterial.codigo,
                  nome: editingMaterial.nome,
                  tipo: editingMaterial.tipo as any,
                  fornecedor_id: editingMaterial.fornecedor_id,
                  certificado_id: editingMaterial.certificado_id,
                  data_rececao: editingMaterial.data_rececao,
                  quantidade: editingMaterial.quantidade,
                  unidade: editingMaterial.unidade,
                  lote: editingMaterial.lote,
                  responsavel: editingMaterial.responsavel,
                  zona: editingMaterial.zona,
                  estado: editingMaterial.estado as any,
                  observacoes: editingMaterial.observacoes
                } : undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
                isEditing={!!editingMaterial}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {viewingMaterial && (
        <MaterialView 
          material={viewingMaterial}
          onClose={() => setViewingMaterial(null)}
        />
      )}
    </div>
  )
} 