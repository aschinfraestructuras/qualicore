import { useState } from 'react'
import { Checklist, PontoInspecao } from '../types'
import { Download, Printer, Filter, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'

interface RelatorioChecklistProps {
  checklists: Checklist[]
  onClose: () => void
}

export default function RelatorioChecklist({ checklists, onClose }: RelatorioChecklistProps) {
  const [filtros, setFiltros] = useState({
    obra: '',
    status: '',
    responsavel: '',
    dataInicio: '',
    dataFim: ''
  })

  const [checklistsSelecionados, setChecklistsSelecionados] = useState<string[]>([])
  const [opcoesRelatorio, setOpcoesRelatorio] = useState({
    incluirPontosPendentes: true,
    incluirPontosAprovados: true,
    incluirPontosReprovados: true,
    incluirAnexos: true,
    incluirComentarios: true,
    incluirTimeline: true,
    nomeObra: ''
  })

  // Filtrar checklists
  const checklistsFiltrados = checklists.filter(checklist => {
    if (filtros.obra && !checklist.obra.toLowerCase().includes(filtros.obra.toLowerCase())) return false
    if (filtros.status && checklist.status !== filtros.status) return false
    if (filtros.responsavel && !checklist.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) return false
    if (filtros.dataInicio && new Date(checklist.data_criacao) < new Date(filtros.dataInicio)) return false
    if (filtros.dataFim && new Date(checklist.data_criacao) > new Date(filtros.dataFim)) return false
    return true
  })

  // Selecionar/desselecionar todos
  const toggleTodos = () => {
    if (checklistsSelecionados.length === checklistsFiltrados.length) {
      setChecklistsSelecionados([])
    } else {
      setChecklistsSelecionados(checklistsFiltrados.map(c => c.id))
    }
  }

  // Toggle seleção individual
  const toggleSelecao = (id: string) => {
    setChecklistsSelecionados(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  // Gerar relatório
  const gerarRelatorio = () => {
    const checklistsParaRelatorio = checklists.filter(c => checklistsSelecionados.includes(c.id))
    
    let relatorio = `RELATÓRIO DE CHECKLISTS DE QUALIDADE\n`
    relatorio += `=====================================\n\n`
    
    if (opcoesRelatorio.nomeObra) {
      relatorio += `Obra: ${opcoesRelatorio.nomeObra}\n`
    }
    relatorio += `Data de geração: ${new Date().toLocaleString('pt-PT')}\n`
    relatorio += `Total de checklists: ${checklistsParaRelatorio.length}\n\n`

    // Estatísticas
    const totalPontos = checklistsParaRelatorio.reduce((acc, c) => acc + c.pontos.length, 0)
    const pontosAprovados = checklistsParaRelatorio.reduce((acc, c) => 
      acc + c.pontos.filter(p => p.status === 'aprovado').length, 0)
    const pontosReprovados = checklistsParaRelatorio.reduce((acc, c) => 
      acc + c.pontos.filter(p => p.status === 'reprovado').length, 0)
    const pontosPendentes = checklistsParaRelatorio.reduce((acc, c) => 
      acc + c.pontos.filter(p => p.status === 'pendente').length, 0)

    relatorio += `ESTATÍSTICAS GERAIS:\n`
    relatorio += `- Total de pontos de inspeção: ${totalPontos}\n`
    relatorio += `- Pontos aprovados: ${pontosAprovados} (${totalPontos > 0 ? ((pontosAprovados/totalPontos)*100).toFixed(1) : 0}%)\n`
    relatorio += `- Pontos reprovados: ${pontosReprovados} (${totalPontos > 0 ? ((pontosReprovados/totalPontos)*100).toFixed(1) : 0}%)\n`
    relatorio += `- Pontos pendentes: ${pontosPendentes} (${totalPontos > 0 ? ((pontosPendentes/totalPontos)*100).toFixed(1) : 0}%)\n\n`

    // Detalhes por checklist
    checklistsParaRelatorio.forEach((checklist, index) => {
      relatorio += `${index + 1}. CHECKLIST: ${checklist.titulo}\n`
      relatorio += `   Obra: ${checklist.obra}\n`
      relatorio += `   Status: ${checklist.status.toUpperCase()}\n`
      relatorio += `   Responsável: ${checklist.responsavel}\n`
      relatorio += `   Data de criação: ${new Date(checklist.data_criacao).toLocaleDateString('pt-PT')}\n`
      relatorio += `   Zona: ${checklist.zona}\n\n`

      if (checklist.observacoes) {
        relatorio += `   Observações: ${checklist.observacoes}\n\n`
      }

      // Pontos de inspeção
      relatorio += `   PONTOS DE INSPEÇÃO:\n`
      checklist.pontos.forEach((ponto, pIndex) => {
        const deveIncluir = (opcoesRelatorio.incluirPontosPendentes && ponto.status === 'pendente') ||
                           (opcoesRelatorio.incluirPontosAprovados && ponto.status === 'aprovado') ||
                           (opcoesRelatorio.incluirPontosReprovados && ponto.status === 'reprovado')

        if (!deveIncluir) return

        relatorio += `   ${pIndex + 1}. ${ponto.descricao}\n`
        relatorio += `      Tipo: ${ponto.tipo}\n`
        relatorio += `      Localização: ${ponto.localizacao}\n`
        relatorio += `      Responsável: ${ponto.responsavel}\n`
        relatorio += `      Status: ${ponto.status.toUpperCase()}\n`
        
        if (ponto.data_inspecao) {
          relatorio += `      Data de inspeção: ${new Date(ponto.data_inspecao).toLocaleDateString('pt-PT')}\n`
        }

        // Timeline
        if (opcoesRelatorio.incluirTimeline && ponto.linha_tempo.length > 0) {
          relatorio += `      Timeline:\n`
          ponto.linha_tempo.forEach(evento => {
            relatorio += `        ${new Date(evento.data).toLocaleString('pt-PT')} - ${evento.acao}: ${evento.detalhes}\n`
          })
        }

        // Comentários
        if (opcoesRelatorio.incluirComentarios && ponto.comentarios && ponto.comentarios.length > 0) {
          relatorio += `      Comentários:\n`
          ponto.comentarios.forEach(comentario => {
            relatorio += `        ${comentario.autor} (${new Date(comentario.data).toLocaleString('pt-PT')}): ${comentario.texto}\n`
          })
        }

        // Anexos
        if (opcoesRelatorio.incluirAnexos && ponto.anexos && ponto.anexos.length > 0) {
          relatorio += `      Anexos:\n`
          ponto.anexos.forEach(anexo => {
            relatorio += `        - ${anexo.nome} (${(anexo.tamanho / 1024).toFixed(1)} KB)\n`
          })
        }

        relatorio += `\n`
      })

      relatorio += `\n`
    })

    // Criar e baixar arquivo
    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_checklists_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Imprimir relatório
  const imprimirRelatorio = () => {
    const checklistsParaRelatorio = checklists.filter(c => checklistsSelecionados.includes(c.id))
    
    let conteudo = `
      <html>
        <head>
          <title>Relatório de Checklists</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .checklist { margin-bottom: 30px; border: 1px solid #ccc; padding: 15px; }
            .ponto { margin: 10px 0; padding: 10px; background: #f9f9f9; }
            .status-aprovado { color: green; }
            .status-reprovado { color: red; }
            .status-pendente { color: orange; }
            .status-correcao { color: #ff6b35; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELATÓRIO DE CHECKLISTS DE QUALIDADE</h1>
            <p>Data: ${new Date().toLocaleDateString('pt-PT')}</p>
            ${opcoesRelatorio.nomeObra ? `<p>Obra: ${opcoesRelatorio.nomeObra}</p>` : ''}
          </div>
    `

    checklistsParaRelatorio.forEach((checklist, index) => {
      conteudo += `
        <div class="checklist">
          <h2>${index + 1}. ${checklist.titulo}</h2>
          <table>
            <tr><th>Obra</th><td>${checklist.obra}</td></tr>
            <tr><th>Status</th><td class="status-${checklist.status}">${checklist.status.toUpperCase()}</td></tr>
            <tr><th>Responsável</th><td>${checklist.responsavel}</td></tr>
            <tr><th>Data de criação</th><td>${new Date(checklist.data_criacao).toLocaleDateString('pt-PT')}</td></tr>
            <tr><th>Zona</th><td>${checklist.zona}</td></tr>
          </table>
      `

      if (checklist.observacoes) {
        conteudo += `<p><strong>Observações:</strong> ${checklist.observacoes}</p>`
      }

      conteudo += `<h3>Pontos de Inspeção:</h3>`

      checklist.pontos.forEach((ponto, pIndex) => {
        const deveIncluir = (opcoesRelatorio.incluirPontosPendentes && ponto.status === 'pendente') ||
                           (opcoesRelatorio.incluirPontosAprovados && ponto.status === 'aprovado') ||
                           (opcoesRelatorio.incluirPontosReprovados && ponto.status === 'reprovado')

        if (!deveIncluir) return

        conteudo += `
          <div class="ponto">
            <h4>${pIndex + 1}. ${ponto.descricao}</h4>
            <p><strong>Status:</strong> <span class="status-${ponto.status}">${ponto.status.toUpperCase()}</span></p>
            <p><strong>Tipo:</strong> ${ponto.tipo}</p>
            <p><strong>Localização:</strong> ${ponto.localizacao}</p>
            <p><strong>Responsável:</strong> ${ponto.responsavel}</p>
        `

        if (ponto.data_inspecao) {
          conteudo += `<p><strong>Data de inspeção:</strong> ${new Date(ponto.data_inspecao).toLocaleDateString('pt-PT')}</p>`
        }

        if (opcoesRelatorio.incluirTimeline && ponto.linha_tempo.length > 0) {
          conteudo += `<p><strong>Timeline:</strong></p><ul>`
          ponto.linha_tempo.forEach(evento => {
            conteudo += `<li>${new Date(evento.data).toLocaleString('pt-PT')} - ${evento.acao}: ${evento.detalhes}</li>`
          })
          conteudo += `</ul>`
        }

        if (opcoesRelatorio.incluirComentarios && ponto.comentarios && ponto.comentarios.length > 0) {
          conteudo += `<p><strong>Comentários:</strong></p><ul>`
          ponto.comentarios.forEach(comentario => {
            conteudo += `<li>${comentario.autor} (${new Date(comentario.data).toLocaleString('pt-PT')}): ${comentario.texto}</li>`
          })
          conteudo += `</ul>`
        }

        if (opcoesRelatorio.incluirAnexos && ponto.anexos && ponto.anexos.length > 0) {
          conteudo += `<p><strong>Anexos:</strong></p><ul>`
          ponto.anexos.forEach(anexo => {
            conteudo += `<li>${anexo.nome} (${(anexo.tamanho / 1024).toFixed(1)} KB)</li>`
          })
          conteudo += `</ul>`
        }

        conteudo += `</div>`
      })

      conteudo += `</div>`
    })

    conteudo += `</body></html>`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(conteudo)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'reprovado': return <XCircle className="h-4 w-4 text-red-600" />
      case 'correcao': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Relatório de Checklists</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Filtros */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Filtrar por obra..."
                value={filtros.obra}
                onChange={e => setFiltros(prev => ({ ...prev, obra: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filtros.status}
                onChange={e => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
              </select>
              <input
                type="text"
                placeholder="Filtrar por responsável..."
                value={filtros.responsavel}
                onChange={e => setFiltros(prev => ({ ...prev, responsavel: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={e => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filtros.dataFim}
                onChange={e => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Opções do relatório */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Opções do Relatório</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Obra (opcional)</label>
                <input
                  type="text"
                  placeholder="Nome da obra para o relatório..."
                  value={opcoesRelatorio.nomeObra}
                  onChange={e => setOpcoesRelatorio(prev => ({ ...prev, nomeObra: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opcoesRelatorio.incluirPontosPendentes}
                    onChange={e => setOpcoesRelatorio(prev => ({ ...prev, incluirPontosPendentes: e.target.checked }))}
                    className="mr-2"
                  />
                  Incluir pontos pendentes
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opcoesRelatorio.incluirPontosAprovados}
                    onChange={e => setOpcoesRelatorio(prev => ({ ...prev, incluirPontosAprovados: e.target.checked }))}
                    className="mr-2"
                  />
                  Incluir pontos aprovados
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opcoesRelatorio.incluirPontosReprovados}
                    onChange={e => setOpcoesRelatorio(prev => ({ ...prev, incluirPontosReprovados: e.target.checked }))}
                    className="mr-2"
                  />
                  Incluir pontos reprovados
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={opcoesRelatorio.incluirAnexos}
                  onChange={e => setOpcoesRelatorio(prev => ({ ...prev, incluirAnexos: e.target.checked }))}
                  className="mr-2"
                />
                Incluir anexos
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={opcoesRelatorio.incluirComentarios}
                  onChange={e => setOpcoesRelatorio(prev => ({ ...prev, incluirComentarios: e.target.checked }))}
                  className="mr-2"
                />
                Incluir comentários
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={opcoesRelatorio.incluirTimeline}
                  onChange={e => setOpcoesRelatorio(prev => ({ ...prev, incluirTimeline: e.target.checked }))}
                  className="mr-2"
                />
                Incluir timeline
              </label>
            </div>
          </div>

          {/* Lista de checklists */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Checklists ({checklistsFiltrados.length} encontrados)
              </h3>
              <button
                onClick={toggleTodos}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {checklistsSelecionados.length === checklistsFiltrados.length ? 'Desselecionar todos' : 'Selecionar todos'}
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {checklistsFiltrados.map(checklist => (
                <div
                  key={checklist.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    checklistsSelecionados.includes(checklist.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleSelecao(checklist.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checklistsSelecionados.includes(checklist.id)}
                        onChange={() => toggleSelecao(checklist.id)}
                        className="mr-2"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{checklist.titulo}</div>
                        <div className="text-sm text-gray-600">{checklist.obra}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(checklist.status)}
                      <span className="text-sm text-gray-600">
                        {checklist.pontos.length} pontos
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {checklistsSelecionados.length} checklist(s) selecionado(s)
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={gerarRelatorio}
                disabled={checklistsSelecionados.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button
                onClick={imprimirRelatorio}
                disabled={checklistsSelecionados.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 