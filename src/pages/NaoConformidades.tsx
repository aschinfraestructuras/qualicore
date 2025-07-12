import { useState, useEffect } from 'react'
import { Plus, AlertTriangle, Clock, CheckCircle, Edit, Trash2, X } from 'lucide-react'
import { naoConformidadesAPI } from '@/lib/pocketbase'
import { NaoConformidadeRecord } from '@/lib/pocketbase'
import toast from 'react-hot-toast'
import NaoConformidadeForm from '@/components/forms/NaoConformidadeForm'

export default function NaoConformidades() {
  const [naoConformidades, setNaoConformidades] = useState<NaoConformidadeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNC, setEditingNC] = useState<NaoConformidadeRecord | null>(null)

  useEffect(() => {
    loadNaoConformidades()
  }, [])

  const loadNaoConformidades = async () => {
    try {
      setLoading(true)
      const data = await naoConformidadesAPI.getAll()
      setNaoConformidades(data)
    } catch (error) {
      console.error('Erro ao carregar não conformidades:', error)
      toast.error('Erro ao carregar não conformidades')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingNC(null)
    setShowForm(true)
  }

  const handleEdit = (nc: NaoConformidadeRecord) => {
    setEditingNC(nc)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingNC) {
        await naoConformidadesAPI.update(editingNC.id, data)
        toast.success('Não conformidade atualizada com sucesso!')
      } else {
        await naoConformidadesAPI.create(data)
        toast.success('Não conformidade criada com sucesso!')
      }
      setShowForm(false)
      loadNaoConformidades()
    } catch (error) {
      console.error('Erro ao salvar não conformidade:', error)
      toast.error('Erro ao salvar não conformidade')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta não conformidade?')) {
      try {
        await naoConformidadesAPI.delete(id)
        toast.success('Não conformidade excluída com sucesso!')
        loadNaoConformidades()
      } catch (error) {
        console.error('Erro ao excluir não conformidade:', error)
        toast.error('Erro ao excluir não conformidade')
      }
    }
  }

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'critica': return 'badge-error'
      case 'alta': return 'badge-warning'
      case 'media': return 'badge-info'
      case 'baixa': return 'badge-success'
      default: return 'badge-secondary'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Não Conformidades</h1>
          <p className="text-gray-600">Gestão de não conformidades e ações corretivas</p>
        </div>
        <button 
          className="btn btn-primary btn-md"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Não Conformidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{naoConformidades.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {naoConformidades.filter(n => n.estado === 'pendente').length}
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
                <p className="text-sm font-medium text-gray-600">Resolvidas</p>
                <p className="text-2xl font-bold text-green-600">
                  {naoConformidades.filter(n => n.estado === 'concluido').length}
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
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">
                  {naoConformidades.filter(n => n.severidade === 'critica').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Não Conformidades</h3>
          <p className="card-description">
            {naoConformidades.length} não conformidade(s) encontrada(s)
          </p>
        </div>
        <div className="card-content">
          {naoConformidades.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma não conformidade encontrada</p>
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Não Conformidade
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {naoConformidades.map((nc) => (
                <div key={nc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{nc.codigo}</h4>
                          <span className={`badge ${getSeveridadeColor(nc.severidade)}`}>
                            {nc.severidade}
                          </span>
                          <span className={`badge ${nc.estado === 'concluido' ? 'badge-success' : 'badge-warning'}`}>
                            {nc.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {nc.tipo} - {nc.responsavel}
                        </p>
                        <p className="text-xs text-gray-500">
                          Detetada em {new Date(nc.data_deteccao).toLocaleDateString('pt-PT')}
                          {nc.data_resolucao && ` - Resolvida em ${new Date(nc.data_resolucao).toLocaleDateString('pt-PT')}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(nc)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(nc.id)}
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
                {editingNC ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
              </h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <NaoConformidadeForm 
                initialData={editingNC ? {
                  codigo: editingNC.codigo,
                  tipo: editingNC.tipo as any,
                  severidade: editingNC.severidade as any,
                  data_deteccao: editingNC.data_deteccao,
                  data_resolucao: editingNC.data_resolucao,
                  acao_corretiva: editingNC.acao_corretiva,
                  responsavel_resolucao: editingNC.responsavel_resolucao,
                  custo_estimado: editingNC.custo_estimado,
                  relacionado_ensaio_id: editingNC.relacionado_ensaio_id,
                  relacionado_material_id: editingNC.relacionado_material_id,
                  responsavel: editingNC.responsavel,
                  zona: editingNC.zona,
                  estado: editingNC.estado as any,
                  observacoes: editingNC.observacoes
                } : undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 