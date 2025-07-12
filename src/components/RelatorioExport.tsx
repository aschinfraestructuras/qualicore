import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, CheckSquare, Square, Filter, Search, Building, Calendar, User } from 'lucide-react'
import { EnsaioRecord } from '@/lib/pocketbase'

interface RelatorioExportProps {
  ensaios: EnsaioRecord[]
  onClose: () => void
}

interface RelatorioConfig {
  nomeObra: string
  dataInicio: string
  dataFim: string
  tipoRelatorio: 'completo' | 'resumo' | 'nao_conformes'
  formato: 'pdf' | 'excel'
}

export default function RelatorioExport({ ensaios, onClose }: RelatorioExportProps) {
  const [selectedEnsaios, setSelectedEnsaios] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterZona, setFilterZona] = useState('')
  const [config, setConfig] = useState<RelatorioConfig>({
    nomeObra: '',
    dataInicio: '',
    dataFim: '',
    tipoRelatorio: 'completo',
    formato: 'pdf'
  })

  // Filtros disponíveis
  const tiposEnsaio = [...new Set(ensaios.map(e => e.tipo))]
  const estados = [...new Set(ensaios.map(e => e.estado))]
  const zonas = [...new Set(ensaios.map(e => e.zona))]

  // Filtrar ensaios
  const filteredEnsaios = ensaios.filter(ensaio => {
    const matchesSearch = ensaio.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ensaio.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ensaio.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = !filterTipo || ensaio.tipo === filterTipo
    const matchesEstado = !filterEstado || ensaio.estado === filterEstado
    const matchesZona = !filterZona || ensaio.zona === filterZona

    return matchesSearch && matchesTipo && matchesEstado && matchesZona
  })

  // Seleção em massa
  const handleSelectAll = () => {
    if (selectedEnsaios.length === filteredEnsaios.length) {
      setSelectedEnsaios([])
    } else {
      setSelectedEnsaios(filteredEnsaios.map(e => e.id))
    }
  }

  const handleSelectEnsaio = (id: string) => {
    setSelectedEnsaios(prev => 
      prev.includes(id) 
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }

  // Gerar relatório
  const generateRelatorio = () => {
    if (selectedEnsaios.length === 0) {
      alert('Selecione pelo menos um ensaio para gerar o relatório.')
      return
    }

    if (!config.nomeObra.trim()) {
      alert('Por favor, insira o nome da obra.')
      return
    }

    const selectedEnsaiosData = ensaios.filter(e => selectedEnsaios.includes(e.id))
    
    // Aqui seria feita a geração real do PDF/Excel
    // Por agora, vamos simular e mostrar os dados no console
    console.log('Gerando relatório:', {
      config,
      ensaios: selectedEnsaiosData,
      total: selectedEnsaiosData.length
    })

    // Simular download
    const blob = new Blob([
      `Relatório de Ensaios - ${config.nomeObra}\n` +
      `Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
      `Total de Ensaios: ${selectedEnsaiosData.length}\n\n` +
      selectedEnsaiosData.map(e => 
        `${e.codigo} | ${e.tipo} | ${e.resultado} | ${e.conforme ? 'Conforme' : 'Não Conforme'} | ${e.data_ensaio}`
      ).join('\n')
    ], { type: 'text/plain' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_ensaios_${config.nomeObra.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert(`Relatório gerado com sucesso! ${selectedEnsaiosData.length} ensaios incluídos.`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">Exportar Relatório de Ensaios</h2>
                <p className="text-blue-100">Selecione os ensaios e configure o relatório</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Painel Esquerdo - Configuração */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Configurações do Relatório */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Configurações do Relatório
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Obra *
                    </label>
                    <input
                      type="text"
                      value={config.nomeObra}
                      onChange={(e) => setConfig(prev => ({ ...prev, nomeObra: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Edifício Residencial Centro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Início
                      </label>
                      <input
                        type="date"
                        value={config.dataInicio}
                        onChange={(e) => setConfig(prev => ({ ...prev, dataInicio: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Fim
                      </label>
                      <input
                        type="date"
                        value={config.dataFim}
                        onChange={(e) => setConfig(prev => ({ ...prev, dataFim: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Relatório
                    </label>
                    <select
                      value={config.tipoRelatorio}
                      onChange={(e) => setConfig(prev => ({ ...prev, tipoRelatorio: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="completo">Relatório Completo</option>
                      <option value="resumo">Resumo Executivo</option>
                      <option value="nao_conformes">Apenas Não Conformes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato
                    </label>
                    <select
                      value={config.formato}
                      onChange={(e) => setConfig(prev => ({ ...prev, formato: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Estatísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de Ensaios:</span>
                    <span className="font-medium">{ensaios.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selecionados:</span>
                    <span className="font-medium text-blue-600">{selectedEnsaios.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conformes:</span>
                    <span className="font-medium text-green-600">
                      {ensaios.filter(e => e.conforme).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Não Conformes:</span>
                    <span className="font-medium text-red-600">
                      {ensaios.filter(e => !e.conforme).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão Gerar */}
              <button
                onClick={generateRelatorio}
                disabled={selectedEnsaios.length === 0 || !config.nomeObra.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Gerar Relatório</span>
              </button>
            </div>
          </div>

          {/* Painel Direito - Lista de Ensaios */}
          <div className="w-2/3 p-6 overflow-y-auto">
            {/* Filtros */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Pesquisar por código, tipo ou responsável..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Filter className="h-5 w-5 text-gray-500" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os Tipos</option>
                  {tiposEnsaio.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>

                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os Estados</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>

                <select
                  value={filterZona}
                  onChange={(e) => setFilterZona(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as Zonas</option>
                  {zonas.map(zona => (
                    <option key={zona} value={zona}>{zona}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de Ensaios */}
            <div className="space-y-2">
              {/* Header da lista */}
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2"
                >
                  {selectedEnsaios.length === filteredEnsaios.length ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                  <span>Selecionar Todos</span>
                </button>
                <span className="text-gray-500">
                  {filteredEnsaios.length} ensaios encontrados
                </span>
              </div>

              {/* Lista */}
              {filteredEnsaios.map(ensaio => (
                <div
                  key={ensaio.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <button
                    onClick={() => handleSelectEnsaio(ensaio.id)}
                    className="flex-shrink-0"
                  >
                    {selectedEnsaios.includes(ensaio.id) ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{ensaio.codigo}</h4>
                        <p className="text-sm text-gray-600">{ensaio.tipo}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ensaio.conforme 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {ensaio.conforme ? 'Conforme' : 'Não Conforme'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{ensaio.responsavel}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ensaio.data_ensaio).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{ensaio.zona}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEnsaios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum ensaio encontrado com os filtros aplicados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 