import { useState } from 'react'
import { NaoConformidade } from '@/types'
import NaoConformidadeForm from '@/components/forms/NaoConformidadeForm'
import toast from 'react-hot-toast'

// MOCKS REALISTAS
const mockNCs: NaoConformidade[] = [
  {
    id: 'nc-001',
    codigo: 'NC-001',
    data_criacao: '2024-06-01',
    data_atualizacao: '2024-06-01',
    responsavel: 'João Silva',
    zona: 'zona-001',
    estado: 'pendente',
    tipo: 'material',
    severidade: 'alta',
    categoria: 'auditoria',
    data_deteccao: '2024-06-01',
    descricao: 'Fissuras em blocos de alvenaria na Zona A',
    impacto: 'alto',
    area_afetada: 'Zona A - Fundações',
    responsavel_deteccao: 'João Silva',
    responsavel_resolucao: 'Maria Costa',
    // Integração correta
    relacionado_obra_id: 'obra-001',
    relacionado_zona_id: 'zona-001',
    relacionado_ensaio_id: 'ensaio-001',
    relacionado_material_id: 'mat-001',
    relacionado_checklist_id: 'chk-001',
    relacionado_fornecedor_id: 'forn-001',
    auditoria_id: 'aud-001',
    timeline: [
      {
        id: 'evt-001',
        data: '2024-06-01',
        tipo: 'deteccao',
        responsavel: 'João Silva',
        descricao: 'Detectada em auditoria interna.'
      },
      {
        id: 'evt-002',
        data: '2024-06-02',
        tipo: 'analise',
        responsavel: 'Maria Costa',
        descricao: 'Análise de causa: possível problema de cura do material.'
      }
    ],
    observacoes: 'Detectada durante auditoria.',
    anexos_evidencia: [],
    anexos_corretiva: [],
    anexos_verificacao: []
  }
]



export default function NaoConformidades() {
  const [naoConformidades, setNaoConformidades] = useState<NaoConformidade[]>(mockNCs)
  const [showForm, setShowForm] = useState(false)
  const [editingNC, setEditingNC] = useState<NaoConformidade | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterSeveridade, setFilterSeveridade] = useState('')

  // Função para obter nome da obra
  const getObraNome = (obraId: string): string => {
    try {
      const stored = localStorage.getItem('qualicore_obras')
      if (stored) {
        const obras = JSON.parse(stored)
        const obra = obras.find((o: any) => o.id === obraId)
        return obra ? obra.nome : obraId
      }
    } catch (error) {
      console.error('Erro ao buscar obra:', error)
    }
    return obraId
  }

  // KPIs simulados
  const total = naoConformidades.length
  const pendentes = naoConformidades.filter(nc => nc.estado === 'pendente').length
  const resolvidas = naoConformidades.filter(nc => nc.estado === 'concluido').length
  const criticas = naoConformidades.filter(nc => nc.severidade === 'critica').length

  const handleCreateNC = () => {
    setEditingNC(null)
    setShowForm(true)
  }

  const handleCreateAuditoria = () => {
    toast.success('Funcionalidade de auditoria será implementada em breve!')
    // TODO: Implementar modal/formulário de auditoria
  }

  const handleExportar = () => {
    toast.success('Funcionalidade de exportação será implementada em breve!')
    // TODO: Implementar exportação para PDF/Excel
  }

  const handleSubmitNC = async (data: any) => {
    try {
      if (editingNC) {
        // Atualizar NC existente
        const updatedNCs = naoConformidades.map(nc => 
          nc.id === editingNC.id ? { ...nc, ...data } : nc
        )
        setNaoConformidades(updatedNCs)
        toast.success('Não conformidade atualizada com sucesso!')
      } else {
        // Criar nova NC
        const newNC: NaoConformidade = {
          id: `nc-${Date.now()}`,
          codigo: data.codigo,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
          responsavel: data.responsavel_deteccao,
          zona: data.area_afetada,
          estado: 'pendente',
          ...data
        }
        setNaoConformidades(prev => [newNC, ...prev])
        toast.success('Não conformidade criada com sucesso!')
      }
      setShowForm(false)
    } catch (error) {
      toast.error('Erro ao salvar não conformidade')
      console.error(error)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingNC(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER E AÇÕES RÁPIDAS */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Não Conformidades</h1>
            <p className="text-gray-500">Gestão integrada de NCs, auditorias e medidas corretivas</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateNC} className="btn btn-primary">+ Nova NC</button>
            <button onClick={() => handleCreateAuditoria()} className="btn btn-secondary">+ Auditoria</button>
            <button onClick={() => handleExportar()} className="btn btn-outline">Exportar</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card"><div className="card-content"><p className="text-sm">Total</p><p className="text-2xl font-bold">{total}</p></div></div>
          <div className="card"><div className="card-content"><p className="text-sm">Pendentes</p><p className="text-2xl font-bold text-yellow-600">{pendentes}</p></div></div>
          <div className="card"><div className="card-content"><p className="text-sm">Resolvidas</p><p className="text-2xl font-bold text-green-600">{resolvidas}</p></div></div>
          <div className="card"><div className="card-content"><p className="text-sm">Críticas</p><p className="text-2xl font-bold text-red-600">{criticas}</p></div></div>
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
          <input 
            className="input" 
            placeholder="Pesquisar..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          <select className="input" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="">Tipo</option>
            <option value="material">Material</option>
            <option value="execucao">Execução</option>
            <option value="documentacao">Documentação</option>
            <option value="seguranca">Segurança</option>
            <option value="ambiente">Ambiente</option>
            <option value="qualidade">Qualidade</option>
            <option value="prazo">Prazo</option>
            <option value="custo">Custo</option>
            <option value="outro">Outro</option>
          </select>
          <select className="input" value={filterSeveridade} onChange={e => setFilterSeveridade(e.target.value)}>
            <option value="">Severidade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        {/* LISTA DE NCs */}
        <div className="bg-white rounded-lg shadow divide-y">
          {naoConformidades.map(nc => (
            <div key={nc.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition">
              <div>
                <div className="font-semibold">{nc.descricao}</div>
                <div className="text-xs text-gray-500">{nc.tipo} | {nc.severidade} | {nc.estado} | {nc.data_deteccao}</div>
                <div className="text-xs text-gray-400">
                  {nc.relacionado_obra_id && nc.relacionado_obra_id !== 'outro' && (
                    <>Obra: {getObraNome(nc.relacionado_obra_id)} | </>
                  )}
                  Zona: {nc.relacionado_zona_id}
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="btn btn-sm btn-outline">Ver detalhes</button>
                <button className="btn btn-sm btn-secondary">Ação corretiva</button>
              </div>
            </div>
          ))}
          {naoConformidades.length === 0 && <div className="p-4 text-center text-gray-400">Nenhuma não conformidade encontrada.</div>}
        </div>
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <NaoConformidadeForm
          naoConformidade={editingNC || undefined}
          onSubmit={handleSubmitNC}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
} 