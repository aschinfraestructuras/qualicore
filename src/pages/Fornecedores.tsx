import { useState, useEffect } from 'react'
import { Plus, Building, Mail, Phone, Edit, Trash2, X } from 'lucide-react'
import { fornecedoresAPI } from '@/lib/pocketbase'
import { FornecedorRecord } from '@/lib/pocketbase'
import toast from 'react-hot-toast'
import FornecedorForm from '@/components/forms/FornecedorForm'

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<FornecedorRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState<FornecedorRecord | null>(null)

  useEffect(() => {
    loadFornecedores()
  }, [])

  const loadFornecedores = async () => {
    try {
      setLoading(true)
      const data = await fornecedoresAPI.getAll()
      setFornecedores(data)
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
      toast.error('Erro ao carregar fornecedores')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingFornecedor(null)
    setShowForm(true)
  }

  const handleEdit = (fornecedor: FornecedorRecord) => {
    setEditingFornecedor(fornecedor)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingFornecedor) {
        await fornecedoresAPI.update(editingFornecedor.id, data)
        toast.success('Fornecedor atualizado com sucesso!')
      } else {
        await fornecedoresAPI.create(data)
        toast.success('Fornecedor criado com sucesso!')
      }
      setShowForm(false)
      loadFornecedores()
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error)
      toast.error('Erro ao salvar fornecedor')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await fornecedoresAPI.delete(id)
        toast.success('Fornecedor excluído com sucesso!')
        loadFornecedores()
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error)
        toast.error('Erro ao excluir fornecedor')
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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Fornecedores</h1>
          <p className="text-gray-600">Controlo de fornecedores e parceiros</p>
        </div>
        <button 
          className="btn btn-primary btn-md"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{fornecedores.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {fornecedores.filter(f => f.estado === 'ativo').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Fornecedores</h3>
          <p className="card-description">
            {fornecedores.length} fornecedor(es) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {fornecedores.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum fornecedor encontrado</p>
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Fornecedor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{fornecedor.nome}</h4>
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => handleEdit(fornecedor)}
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            onClick={() => handleDelete(fornecedor.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">NIF: {fornecedor.nif}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{fornecedor.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{fornecedor.telefone}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`badge ${fornecedor.estado === 'ativo' ? 'badge-success' : 'badge-secondary'}`}>
                          {fornecedor.estado}
                        </span>
                      </div>
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <FornecedorForm 
                initialData={editingFornecedor ? {
                  nome: editingFornecedor.nome,
                  nif: editingFornecedor.nif,
                  morada: editingFornecedor.morada,
                  telefone: editingFornecedor.telefone,
                  email: editingFornecedor.email,
                  contacto: editingFornecedor.contacto,
                  estado: editingFornecedor.estado as any
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