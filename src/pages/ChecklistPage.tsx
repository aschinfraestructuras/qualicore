import { useState } from 'react'
import { Plus, FileText, ClipboardList } from 'lucide-react'
import ChecklistForm from '../components/forms/ChecklistForm'
import { Checklist } from '../types'

const mockChecklists: Checklist[] = [
  {
    id: '1',
    codigo: 'CHK-2024-001',
    data_criacao: '2024-06-01',
    data_atualizacao: '2024-06-01',
    responsavel: 'João Silva',
    zona: 'Zona A',
    estado: 'em_analise',
    obra: 'Edifício Central',
    titulo: 'Checklist Estrutural',
    status: 'em_andamento',
    pontos: [],
    observacoes: 'Inspeção inicial da estrutura.'
  }
]

export default function ChecklistPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null)
  const [checklists] = useState<Checklist[]>(mockChecklists)

  const handleCreate = () => {
    setEditingChecklist(null)
    setShowForm(true)
  }

  const handleEdit = (checklist: Checklist) => {
    setEditingChecklist(checklist)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            Checklists / Pontos de Inspeção
          </h1>
          <p className="text-gray-600">Gestão de inspeções, validações e registo documental</p>
        </div>
        <button 
          className="btn btn-primary btn-md"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Checklist
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Checklists Recentes</h3>
        </div>
        <div className="card-content">
          {checklists.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum checklist encontrado</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Obra</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {checklists.map((chk) => (
                  <tr key={chk.id}>
                    <td className="px-4 py-2 font-mono text-sm">{chk.codigo}</td>
                    <td className="px-4 py-2">{chk.obra}</td>
                    <td className="px-4 py-2">{chk.titulo}</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${chk.status === 'aprovado' ? 'badge-success' : chk.status === 'reprovado' ? 'badge-error' : 'badge-warning'}`}>{chk.status}</span>
                    </td>
                    <td className="px-4 py-2">{chk.responsavel}</td>
                    <td className="px-4 py-2">
                      <button className="btn btn-xs btn-secondary mr-2" onClick={() => handleEdit(chk)}>Editar</button>
                      <button className="btn btn-xs btn-outline">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingChecklist ? 'Editar Checklist' : 'Novo Checklist'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <ChecklistForm
                initialData={editingChecklist || undefined}
                onCancel={() => setShowForm(false)}
                onSubmit={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 