import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  TestTube,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react'
import { ensaiosAPI } from '@/lib/pocketbase'
import { EnsaioRecord } from '@/lib/pocketbase'
import toast from 'react-hot-toast'
import EnsaioForm from '@/components/forms/EnsaioForm'

export default function Ensaios() {
  const [ensaios, setEnsaios] = useState<EnsaioRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEnsaio, setEditingEnsaio] = useState<EnsaioRecord | null>(null)

  useEffect(() => {
    loadEnsaios()
  }, [])

  const loadEnsaios = async () => {
    try {
      setLoading(true)
      const data = await ensaiosAPI.getAll()
      setEnsaios(data)
    } catch (error) {
      console.error('Erro ao carregar ensaios:', error)
      toast.error('Erro ao carregar ensaios')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingEnsaio(null)
    setShowForm(true)
  }

  const handleEdit = (ensaio: EnsaioRecord) => {
    setEditingEnsaio(ensaio)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingEnsaio) {
        await ensaiosAPI.update(editingEnsaio.id, data)
        toast.success('Ensaio atualizado com sucesso!')
      } else {
        await ensaiosAPI.create(data)
        toast.success('Ensaio criado com sucesso!')
      }
      setShowForm(false)
      loadEnsaios()
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error)
      toast.error('Erro ao salvar ensaio')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ensaio?')) {
      try {
        await ensaiosAPI.delete(id)
        toast.success('Ensaio excluído com sucesso!')
        loadEnsaios()
      } catch (error) {
        console.error('Erro ao excluir ensaio:', error)
        toast.error('Erro ao excluir ensaio')
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Ensaios Técnicos</h1>
          <p className="text-gray-600">Gestão de ensaios laboratoriais e testes</p>
        </div>
        <button 
          className="btn btn-primary btn-md"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Ensaio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{ensaios.length}</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformes</p>
                <p className="text-2xl font-bold text-green-600">
                  {ensaios.filter(e => e.conforme).length}
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
                <p className="text-sm font-medium text-gray-600">Não Conformes</p>
                <p className="text-2xl font-bold text-red-600">
                  {ensaios.filter(e => !e.conforme).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Ensaios</h3>
          <p className="card-description">
            {ensaios.length} ensaio(s) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {ensaios.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum ensaio encontrado</p>
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Ensaio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ensaios.map((ensaio) => (
                <div key={ensaio.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${ensaio.conforme ? 'bg-green-100' : 'bg-red-100'}`}>
                        <TestTube className={`h-6 w-6 ${ensaio.conforme ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{ensaio.codigo}</h4>
                          <span className={`badge ${ensaio.conforme ? 'badge-success' : 'badge-error'}`}>
                            {ensaio.conforme ? 'Conforme' : 'Não Conforme'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {ensaio.tipo} - {ensaio.laboratorio}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ensaio.valor_obtido} {ensaio.unidade} / {ensaio.valor_esperado} {ensaio.unidade}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(ensaio)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(ensaio.id)}
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
                {editingEnsaio ? 'Editar Ensaio' : 'Novo Ensaio'}
              </h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <EnsaioForm 
                initialData={editingEnsaio ? {
                  codigo: editingEnsaio.codigo,
                  tipo: editingEnsaio.tipo as any,
                  material_id: editingEnsaio.material_id,
                  resultado: editingEnsaio.resultado,
                  valor_obtido: editingEnsaio.valor_obtido,
                  valor_esperado: editingEnsaio.valor_esperado,
                  unidade: editingEnsaio.unidade,
                  laboratorio: editingEnsaio.laboratorio,
                  data_ensaio: editingEnsaio.data_ensaio,
                  conforme: editingEnsaio.conforme,
                  responsavel: editingEnsaio.responsavel,
                  zona: editingEnsaio.zona,
                  estado: editingEnsaio.estado as any,
                  observacoes: editingEnsaio.observacoes
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