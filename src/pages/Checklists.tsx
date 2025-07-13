import { useState, useEffect } from 'react'
import { Plus, ClipboardCheck, CheckCircle, Edit, Trash2, X, FileText } from 'lucide-react'
import { checklistsAPI } from '@/lib/supabase-api'
import toast from 'react-hot-toast'
import ChecklistForm from '@/components/forms/ChecklistForm'
import RelatorioChecklist from '@/components/RelatorioChecklist'

export default function Checklists() {
  const [checklists, setChecklists] = useState<any[]>([]) // Changed type to any[] as Checklist type is removed
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingChecklist, setEditingChecklist] = useState<any | null>(null) // Changed type to any
  const [showRelatorio, setShowRelatorio] = useState(false)

  useEffect(() => {
    loadChecklists()
  }, [])

  const loadChecklists = async () => {
    try {
      setLoading(true)
      const data = await checklistsAPI.getAll()
      setChecklists(data)
    } catch (error) {
      console.error('Erro ao carregar checklists:', error)
      toast.error('Erro ao carregar checklists')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingChecklist(null)
    setShowForm(true)
  }

  const handleEdit = (checklist: any) => { // Changed type to any
    setEditingChecklist(checklist)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      console.log('Dados recebidos do formulário de checklist:', data)
      
      // Separar pontos de inspeção dos dados básicos
      const { pontos, ...checklistData } = data
      
      // Filtrar apenas os campos válidos do schema Supabase
      const validChecklistData = {
        codigo: checklistData.codigo,
        obra_id: checklistData.obra_id || null,
        titulo: checklistData.titulo,
        status: checklistData.status,
        responsavel: checklistData.responsavel,
        zona: checklistData.zona,
        estado: checklistData.estado || 'pendente',
        observacoes: checklistData.observacoes
      }
      
      console.log('Dados corrigidos para envio:', validChecklistData)
      console.log('Pontos de inspeção:', pontos)
      
      if (editingChecklist) {
        await checklistsAPI.updateWithPontos(editingChecklist.id, validChecklistData, pontos || [])
        toast.success('Checklist atualizado com sucesso!')
      } else {
        await checklistsAPI.createWithPontos(validChecklistData, pontos || [])
        toast.success('Checklist criado com sucesso!')
      }
      setShowForm(false)
      loadChecklists()
    } catch (error) {
      console.error('Erro detalhado ao salvar checklist:', error)
      toast.error('Erro ao salvar checklist')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este checklist?')) {
      try {
        await checklistsAPI.delete(id)
        toast.success('Checklist excluído com sucesso!')
        loadChecklists()
      } catch (error) {
        console.error('Erro ao excluir checklist:', error)
        toast.error('Erro ao excluir checklist')
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
          <h1 className="text-2xl font-bold text-gray-900">Checklists de Inspeção</h1>
          <p className="text-gray-600">Gestão de checklists e inspeções</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-secondary btn-md"
            onClick={() => setShowRelatorio(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatório
          </button>
          <button 
            className="btn btn-primary btn-md"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Checklist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{checklists.length}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Conformidade</p>
                <p className="text-2xl font-bold text-green-600">
                  {checklists.length > 0 
                    ? Math.round(checklists.reduce((acc, c) => acc + c.percentual_conformidade, 0) / checklists.length)
                    : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Checklists</h3>
          <p className="card-description">
            {checklists.length} checklist(s) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {checklists.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum checklist encontrado</p>
              <button 
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Checklist
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ClipboardCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{checklist.codigo}</h4>
                          <span className="badge badge-info">{checklist.percentual_conformidade}%</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {checklist.tipo} - {checklist.inspetor}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(checklist.data_inspecao).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(checklist)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(checklist.id)}
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
                {editingChecklist ? 'Editar Checklist' : 'Novo Checklist'}
              </h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <ChecklistForm 
                initialData={editingChecklist ? {
                  obra: editingChecklist.codigo,
                  titulo: editingChecklist.tipo,
                  status: editingChecklist.estado as any,
                  responsavel: editingChecklist.responsavel,
                  zona: editingChecklist.zona,
                  observacoes: editingChecklist.observacoes
                } : undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatório */}
      {showRelatorio && (
        <RelatorioChecklist
          checklists={checklists.map(c => ({
            id: c.id,
            codigo: c.codigo,
            titulo: c.tipo,
            obra: c.codigo,
            status: c.estado as any,
            responsavel: c.responsavel,
            zona: c.zona,
            estado: c.estado as any,
            data_criacao: c.data_inspecao,
            data_atualizacao: c.data_inspecao,
            pontos: [],
            observacoes: c.observacoes
          }))}
          onClose={() => setShowRelatorio(false)}
        />
      )}
    </div>
  )
} 