import { useState, useEffect } from 'react'
import { Plus, Package, CheckCircle, XCircle, Edit, Trash2, X } from 'lucide-react'
import { materiaisAPI } from '@/lib/pocketbase'
import { MaterialRecord } from '@/lib/pocketbase'
import toast from 'react-hot-toast'
import MaterialForm from '@/components/forms/MaterialForm'

export default function Materiais() {
  const [materiais, setMateriais] = useState<MaterialRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<MaterialRecord | null>(null)

  useEffect(() => {
    loadMateriais()
  }, [])

  const loadMateriais = async () => {
    try {
      setLoading(true)
      const data = await materiaisAPI.getAll()
      setMateriais(data)
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
      toast.error('Erro ao carregar materiais')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingMaterial(null)
    setShowForm(true)
  }

  const handleEdit = (material: MaterialRecord) => {
    setEditingMaterial(material)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingMaterial) {
        await materiaisAPI.update(editingMaterial.id, data)
        toast.success('Material atualizado com sucesso!')
      } else {
        await materiaisAPI.create(data)
        toast.success('Material criado com sucesso!')
      }
      setShowForm(false)
      loadMateriais()
    } catch (error) {
      console.error('Erro ao salvar material:', error)
      toast.error('Erro ao salvar material')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este material?')) {
      try {
        await materiaisAPI.delete(id)
        toast.success('Material excluído com sucesso!')
        loadMateriais()
      } catch (error) {
        console.error('Erro ao excluir material:', error)
        toast.error('Erro ao excluir material')
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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Materiais</h1>
          <p className="text-gray-600">Controlo de materiais e stocks</p>
        </div>
        <button 
          className="btn btn-primary btn-md"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{materiais.length}</p>
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
                <p className="text-2xl font-bold text-green-600">
                  {materiais.filter(m => m.estado === 'aprovado').length}
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
                <p className="text-2xl font-bold text-yellow-600">
                  {materiais.filter(m => m.estado === 'pendente').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Materiais</h3>
          <p className="card-description">
            {materiais.length} material(is) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {materiais.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum material encontrado</p>
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Material
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {materiais.map((material) => (
                <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{material.codigo}</h4>
                          <span className={`badge ${material.estado === 'aprovado' ? 'badge-success' : 'badge-warning'}`}>
                            {material.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {material.nome} - {material.tipo}
                        </p>
                        <p className="text-xs text-gray-500">
                          {material.quantidade} {material.unidade} - Lote: {material.lote}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(material.id)}
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 