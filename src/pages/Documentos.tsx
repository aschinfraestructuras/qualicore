import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Calendar,
  User,
  MapPin,
  Printer,
  Upload,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  File,
  FileCheck,
  FileX,
  ArrowUpDown,
  Filter as FilterIcon
} from 'lucide-react'
import { documentosAPI } from '@/lib/pocketbase'
import { DocumentoRecord } from '@/lib/pocketbase'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/Modal'
import DocumentoForm from '@/components/forms/DocumentoForm'

// Dados mockados mais realistas
const mockDocumentos = [
  {
    id: '1',
    codigo: 'DOC-2024-001',
    tipo: 'especificacao',
    versao: '1.0',
    data_validade: '2024-12-31',
    responsavel: 'Maria Santos',
    zona: 'Zona A - Fundações',
    estado: 'aprovado',
    observacoes: 'Especificação técnica para betão estrutural C30/37',
    created: '2024-01-10T10:00:00Z',
    updated: '2024-01-10T15:30:00Z'
  },
  {
    id: '2',
    codigo: 'DOC-2024-002',
    tipo: 'projeto',
    versao: '2.1',
    data_validade: '2024-06-30',
    responsavel: 'João Silva',
    zona: 'Zona B - Pilares',
    estado: 'em_analise',
    observacoes: 'Projeto de armaduras para pilares principais',
    created: '2024-01-09T14:20:00Z',
    updated: '2024-01-10T09:15:00Z'
  },
  {
    id: '3',
    codigo: 'DOC-2024-003',
    tipo: 'relatorio',
    versao: '1.2',
    data_validade: '2024-03-15',
    responsavel: 'Carlos Mendes',
    zona: 'Zona C - Lajes',
    estado: 'pendente',
    observacoes: 'Relatório de inspeção de cofragem',
    created: '2024-01-08T16:45:00Z',
    updated: '2024-01-08T16:45:00Z'
  },
  {
    id: '4',
    codigo: 'DOC-2024-004',
    tipo: 'certificado',
    versao: '1.0',
    data_validade: '2025-01-15',
    responsavel: 'Ana Costa',
    zona: 'Armazém Central',
    estado: 'aprovado',
    observacoes: 'Certificado de conformidade - Cimento CEM I',
    created: '2024-01-07T11:30:00Z',
    updated: '2024-01-07T11:30:00Z'
  },
  {
    id: '5',
    codigo: 'DOC-2024-005',
    tipo: 'projeto',
    versao: '1.5',
    data_validade: '2024-08-20',
    responsavel: 'Pedro Alves',
    zona: 'Zona D - Estrutura',
    estado: 'reprovado',
    observacoes: 'Projeto de ligações estruturais - necessita revisão',
    created: '2024-01-06T13:15:00Z',
    updated: '2024-01-09T17:20:00Z'
  }
]

const documentTypes = [
  { value: 'projeto', label: 'Projeto', icon: FileText, color: 'text-blue-600' },
  { value: 'especificacao', label: 'Especificação', icon: FileCheck, color: 'text-green-600' },
  { value: 'relatorio', label: 'Relatório', icon: File, color: 'text-purple-600' },
  { value: 'certificado', label: 'Certificado', icon: FileCheck, color: 'text-orange-600' },
  { value: 'outro', label: 'Outro', icon: File, color: 'text-gray-600' }
]

const statusOptions = [
  { value: 'pendente', label: 'Pendente', color: 'bg-warning-100 text-warning-700' },
  { value: 'em_analise', label: 'Em Análise', color: 'bg-info-100 text-info-700' },
  { value: 'aprovado', label: 'Aprovado', color: 'bg-success-100 text-success-700' },
  { value: 'reprovado', label: 'Reprovado', color: 'bg-danger-100 text-danger-700' },
  { value: 'concluido', label: 'Concluído', color: 'bg-gray-100 text-gray-700' }
]

export default function Documentos() {
  const [documentos, setDocumentos] = useState<DocumentoRecord[]>(mockDocumentos)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterZona, setFilterZona] = useState('')
  const [sortBy, setSortBy] = useState('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  
  // Estados para modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<DocumentoRecord | null>(null)
  const [viewingDocument, setViewingDocument] = useState<DocumentoRecord | null>(null)

  useEffect(() => {
    loadDocumentos()
  }, [])

  const loadDocumentos = async () => {
    try {
      setLoading(true)
      // const data = await documentosAPI.getAll()
      // setDocumentos(data)
      // Usando dados mockados por enquanto
      setDocumentos(mockDocumentos)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
      toast.error('Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.observacoes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = !filterEstado || doc.estado === filterEstado
    const matchesTipo = !filterTipo || doc.tipo === filterTipo
    const matchesZona = !filterZona || doc.zona.includes(filterZona)
    
    return matchesSearch && matchesEstado && matchesTipo && matchesZona
  })

  const sortedDocumentos = [...filteredDocumentos].sort((a, b) => {
    const aValue = a[sortBy as keyof DocumentoRecord] || ''
    const bValue = b[sortBy as keyof DocumentoRecord] || ''
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getEstadoInfo = (estado: string) => {
    return statusOptions.find(s => s.value === estado) || statusOptions[0]
  }

  const getTipoInfo = (tipo: string) => {
    return documentTypes.find(t => t.value === tipo) || documentTypes[4]
  }

  const handleCreateDocument = (data: any) => {
    const newDocument: DocumentoRecord = {
      id: Date.now().toString(),
      ...data,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
    setDocumentos(prev => [newDocument, ...prev])
    setShowCreateModal(false)
    toast.success('Documento criado com sucesso!')
  }

  const handleEditDocument = (data: any) => {
    if (!editingDocument) return
    
    const updatedDocument: DocumentoRecord = {
      ...editingDocument,
      ...data,
      updated: new Date().toISOString()
    }
    
    setDocumentos(prev => prev.map(doc => 
      doc.id === editingDocument.id ? updatedDocument : doc
    ))
    setShowEditModal(false)
    setEditingDocument(null)
    toast.success('Documento atualizado com sucesso!')
  }

  const handleViewDocument = (document: DocumentoRecord) => {
    setViewingDocument(document)
    setShowViewModal(true)
  }

  const handleEditClick = (document: DocumentoRecord) => {
    setEditingDocument(document)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer eliminar este documento?')) {
      try {
        // await documentosAPI.delete(id)
        setDocumentos(prev => prev.filter(doc => doc.id !== id))
        toast.success('Documento eliminado com sucesso')
      } catch (error) {
        toast.error('Erro ao eliminar documento')
      }
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Código', 'Tipo', 'Versão', 'Responsável', 'Zona', 'Estado', 'Data Validade', 'Observações'],
      ...sortedDocumentos.map(doc => [
        doc.codigo,
        getTipoInfo(doc.tipo).label,
        doc.versao,
        doc.responsavel,
        doc.zona,
        getEstadoInfo(doc.estado).label,
        doc.data_validade || '-',
        doc.observacoes || '-'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `documentos_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exportação concluída')
  }

  const handleBulkAction = (action: string) => {
    if (selectedDocuments.length === 0) {
      toast.error('Selecione pelo menos um documento')
      return
    }
    
    switch (action) {
      case 'delete':
        if (confirm(`Eliminar ${selectedDocuments.length} documento(s)?`)) {
          toast.success(`${selectedDocuments.length} documento(s) eliminado(s)`)
          setSelectedDocuments([])
        }
        break
      case 'export':
        toast.success(`${selectedDocuments.length} documento(s) exportado(s)`)
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-8 w-8"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Documentos</h1>
            <p className="text-gray-600 mt-1">Gestão completa de documentação técnica</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-outline btn-md"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Documento
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total', value: documentos.length, icon: FileText, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
          { label: 'Aprovados', value: documentos.filter(d => d.estado === 'aprovado').length, icon: CheckCircle, color: 'bg-gradient-to-br from-green-500 to-green-600' },
          { label: 'Pendentes', value: documentos.filter(d => d.estado === 'pendente').length, icon: Clock, color: 'bg-gradient-to-br from-warning-500 to-warning-600' },
          { label: 'Em Análise', value: documentos.filter(d => d.estado === 'em_analise').length, icon: AlertTriangle, color: 'bg-gradient-to-br from-info-500 to-info-600' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} shadow-glow`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Tipo Filter */}
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="select"
            >
              <option value="">Todos os tipos</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Estado Filter */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="select"
            >
              <option value="">Todos os estados</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            {/* Zona Filter */}
            <select
              value={filterZona}
              onChange={(e) => setFilterZona(e.target.value)}
              className="select"
            >
              <option value="">Todas as zonas</option>
              {Array.from(new Set(documentos.map(d => d.zona))).map(zona => (
                <option key={zona} value={zona}>{zona}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Actions Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <File className="h-5 w-5" />
            </button>
          </div>
          
          <span className="text-sm text-gray-600">
            {sortedDocumentos.length} documento(s) encontrado(s)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {selectedDocuments.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedDocuments.length} selecionado(s)
              </span>
              <button
                onClick={() => handleBulkAction('export')}
                className="btn btn-outline btn-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </button>
            </div>
          )}
          
          <button
            onClick={handleExport}
            className="btn btn-secondary btn-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar Todos
          </button>
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === sortedDocumentos.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments(sortedDocumentos.map(d => d.id))
                        } else {
                          setSelectedDocuments([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th>
                    <button
                      onClick={() => {
                        setSortBy('codigo')
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      }}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                    >
                      <span>Código</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th>Tipo</th>
                  <th>Versão</th>
                  <th>Responsável</th>
                  <th>Zona</th>
                  <th>
                    <button
                      onClick={() => {
                        setSortBy('estado')
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      }}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                    >
                      <span>Estado</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th>Data Validade</th>
                  <th>
                    <button
                      onClick={() => {
                        setSortBy('created')
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      }}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                    >
                      <span>Criado</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-20">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedDocumentos.map((doc, index) => {
                    const tipoInfo = getTipoInfo(doc.tipo)
                    const estadoInfo = getEstadoInfo(doc.estado)
                    const TipoIcon = tipoInfo.icon
                    
                    return (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50/50"
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocuments([...selectedDocuments, doc.id])
                              } else {
                                setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <TipoIcon className={`h-4 w-4 ${tipoInfo.color}`} />
                            <span className="font-medium text-gray-900">{doc.codigo}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm text-gray-700">{tipoInfo.label}</span>
                        </td>
                        <td>
                          <span className="text-sm font-medium text-gray-900">{doc.versao}</span>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {doc.responsavel.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">{doc.responsavel}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm text-gray-700">{doc.zona}</span>
                        </td>
                        <td>
                          <span className={`badge ${estadoInfo.color}`}>
                            {estadoInfo.label}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm text-gray-700">
                            {doc.data_validade ? new Date(doc.data_validade).toLocaleDateString('pt-BR') : '-'}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm text-gray-500">
                            {new Date(doc.created).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleViewDocument(doc)}
                              className="p-1 rounded-lg hover:bg-gray-100 transition-colors" 
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleEditClick(doc)}
                              className="p-1 rounded-lg hover:bg-gray-100 transition-colors" 
                              title="Editar"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => {
                                // Implementar impressão
                                toast.success('Funcionalidade de impressão em desenvolvimento')
                              }}
                              className="p-1 rounded-lg hover:bg-gray-100 transition-colors" 
                              title="Imprimir"
                            >
                              <Printer className="h-4 w-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete(doc.id)}
                              className="p-1 rounded-lg hover:bg-red-100 transition-colors" 
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      
      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Documento"
        size="xl"
      >
        <DocumentoForm
          onSubmit={handleCreateDocument}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingDocument(null)
        }}
        title="Editar Documento"
        size="xl"
      >
        {editingDocument && (
          <DocumentoForm
            onSubmit={handleEditDocument}
            onCancel={() => {
              setShowEditModal(false)
              setEditingDocument(null)
            }}
            initialData={editingDocument as any}
            isEditing={true}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setViewingDocument(null)
        }}
        title="Visualizar Documento"
        size="lg"
      >
        {viewingDocument && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
                <p className="text-lg font-semibold text-gray-900">{viewingDocument.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <span className={`badge ${getTipoInfo(viewingDocument.tipo).color}`}>
                  {getTipoInfo(viewingDocument.tipo).label}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Versão</label>
                <p className="text-gray-900">{viewingDocument.versao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <span className={`badge ${getEstadoInfo(viewingDocument.estado).color}`}>
                  {getEstadoInfo(viewingDocument.estado).label}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                <p className="text-gray-900">{viewingDocument.responsavel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona</label>
                <p className="text-gray-900">{viewingDocument.zona}</p>
              </div>
              {viewingDocument.data_validade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Validade</label>
                  <p className="text-gray-900">
                    {new Date(viewingDocument.data_validade).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
            
            {viewingDocument.observacoes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {viewingDocument.observacoes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Criado em: {new Date(viewingDocument.created).toLocaleString('pt-BR')}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEditClick(viewingDocument)
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    // Implementar impressão
                    toast.success('Funcionalidade de impressão em desenvolvimento')
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
} 