import { useState, useEffect } from 'react'
import { HelpCircle, Plus, Search, Filter, FileText, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import RFIForm from '../components/forms/RFIForm'
import { RFI, rfisAPI } from '@/lib/supabase-api'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

export default function RFIs() {
  const [rfis, setRFIs] = useState<RFI[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingRFI, setEditingRFI] = useState<RFI | null>(null)

  // Carregar RFIs
  useEffect(() => {
    loadRFIs()
  }, [])

  const loadRFIs = async () => {
    try {
      setLoading(true)
      const data = await rfisAPI.getAll()
      setRFIs(data || [])
    } catch (error) {
      toast.error('Erro ao carregar RFIs')
      console.error('Erro ao carregar RFIs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRFIs = rfis.filter(rfi =>
    rfi.titulo.toLowerCase().includes(search.toLowerCase()) ||
    rfi.numero.toLowerCase().includes(search.toLowerCase()) ||
    rfi.solicitante.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    setEditingRFI(null)
    setShowForm(true)
  }

  const handleEdit = (rfi: RFI) => {
    setEditingRFI(rfi)
    setShowForm(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      // Garante que o campo 'codigo' está presente
      const rfiData = {
        codigo: data.codigo,
        numero: data.numero,
        titulo: data.titulo,
        descricao: data.descricao,
        solicitante: data.solicitante,
        destinatario: data.destinatario,
        data_solicitacao: data.data_solicitacao,
        data_resposta: data.data_resposta,
        prioridade: data.prioridade,
        status: data.status,
        resposta: data.resposta,
        impacto_custo: data.impacto_custo,
        impacto_prazo: data.impacto_prazo,
        observacoes: data.observacoes
      }
      if (editingRFI) {
        await rfisAPI.update(editingRFI.id, rfiData)
        toast.success('RFI atualizado com sucesso!')
      } else {
        await rfisAPI.create(rfiData)
        toast.success('RFI criado com sucesso!')
      }
      await loadRFIs()
      setShowForm(false)
    } catch (error) {
      toast.error('Erro ao salvar RFI')
      console.error('Erro ao salvar RFI:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este RFI?')) {
      try {
        await rfisAPI.delete(id)
        toast.success('RFI eliminado com sucesso!')
        await loadRFIs()
      } catch (error) {
        toast.error('Erro ao eliminar RFI')
        console.error('Erro ao eliminar RFI:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <HelpCircle className="h-7 w-7 text-blue-500" /> RFIs (Pedidos de Informação)
          </h1>
          <p className="text-gray-600 mt-1">Gestão centralizada de todos os pedidos de informação da obra.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Novo RFI
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
          <input
            type="text"
            placeholder="Pesquisar RFI..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Nº</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Título</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Solicitante</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Destinatário</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Data</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Prioridade</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-blue-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRFIs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">Nenhum RFI encontrado.</td>
              </tr>
            )}
            {filteredRFIs.map(rfi => (
              <tr key={rfi.id} className="hover:bg-blue-50/40 transition">
                <td className="px-4 py-3 font-mono text-xs text-blue-900">{rfi.numero}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{rfi.titulo}</td>
                <td className="px-4 py-3 text-gray-700">{rfi.solicitante}</td>
                <td className="px-4 py-3 text-gray-700">{rfi.destinatario}</td>
                <td className="px-4 py-3 text-gray-600">{rfi.data_solicitacao}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${rfi.prioridade === 'alta' ? 'bg-red-100 text-red-700' : rfi.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{rfi.prioridade}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${rfi.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' : rfi.status === 'em_analise' ? 'bg-blue-100 text-blue-700' : rfi.status === 'respondido' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{rfi.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(rfi)} className="btn btn-xs btn-outline mr-2">Editar</button>
                  <button onClick={() => handleDelete(rfi.id)} className="btn btn-xs btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingRFI ? 'Editar RFI' : 'Novo RFI'} size="md">
        <RFIForm initialData={editingRFI || undefined} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
} 