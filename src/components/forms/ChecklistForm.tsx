import { useState } from 'react'
import { Checklist, PontoInspecao, EventoPonto } from '../../types'
import { Plus, X, Upload, File, Download, Trash2 } from 'lucide-react'

interface ChecklistFormProps {
  initialData?: Partial<Checklist>
  onCancel: () => void
  onSubmit: (data: Checklist) => void
}

export default function ChecklistForm({ initialData, onCancel, onSubmit }: ChecklistFormProps) {
  const [formData, setFormData] = useState<Partial<Checklist>>({
    obra: initialData?.obra || '',
    titulo: initialData?.titulo || '',
    status: initialData?.status || 'em_andamento',
    pontos: initialData?.pontos || [],
    observacoes: initialData?.observacoes || ''
  })

  // Pontos de inspeção dinâmicos
  const addPonto = () => {
    setFormData(prev => ({
      ...prev,
      pontos: [
        ...(prev.pontos || []),
        {
          id: Date.now().toString(),
          descricao: '',
          tipo: '',
          localizacao: '',
          responsavel: '',
          status: 'pendente',
          data_inspecao: '',
          linha_tempo: []
        } as PontoInspecao
      ]
    }))
  }

  const removePonto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).filter((_, i) => i !== index)
    }))
  }

  const updatePonto = (index: number, field: keyof PontoInspecao, value: string) => {
    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }))
  }

  // Adicionar evento à linha do tempo de um ponto
  const addEventoPonto = (index: number, acao: EventoPonto['acao'], detalhes: string) => {
    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              linha_tempo: [
                ...(p.linha_tempo || []),
                {
                  id: Date.now().toString(),
                  data: new Date().toISOString(),
                  acao,
                  responsavel: p.responsavel || '',
                  detalhes
                } as EventoPonto
              ]
            }
          : p
      )
    }))
  }

  // Adicionar anexo a um ponto de inspeção
  const addAnexoPonto = (index: number, file: File) => {
    const anexo = {
      id: Date.now().toString(),
      nome: file.name,
      tipo: file.type,
      tamanho: file.size,
      data_upload: new Date().toISOString(),
      url: URL.createObjectURL(file) // Simulação - em produção seria upload real
    }

    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              anexos: [...(p.anexos || []), anexo]
            }
          : p
      )
    }))
  }

  // Remover anexo de um ponto de inspeção
  const removeAnexoPonto = (pontoIndex: number, anexoId: string) => {
    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === pontoIndex
          ? {
              ...p,
              anexos: (p.anexos || []).filter(a => a.id !== anexoId)
            }
          : p
      )
    }))
  }

  // Adicionar comentário a um ponto de inspeção
  const addComentarioPonto = (index: number, texto: string) => {
    const comentario = {
      id: Date.now().toString(),
      autor: 'Usuário Atual', // Em produção seria o usuário logado
      data: new Date().toISOString(),
      texto,
      ponto_id: (formData.pontos || [])[index].id
    }

    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              comentarios: [...(p.comentarios || []), comentario]
            }
          : p
      )
    }))
  }

  // Remover comentário de um ponto de inspeção
  const removeComentarioPonto = (pontoIndex: number, comentarioId: string) => {
    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === pontoIndex
          ? {
              ...p,
              comentarios: (p.comentarios || []).filter(c => c.id !== comentarioId)
            }
          : p
      )
    }))
  }

  // Atualizar status de um ponto de inspeção
  const updateStatusPonto = (index: number, novoStatus: PontoInspecao['status']) => {
    setFormData(prev => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              status: novoStatus,
              data_inspecao: novoStatus !== 'pendente' ? new Date().toISOString() : p.data_inspecao
            }
          : p
      )
    }))

    // Adicionar evento à linha do tempo
    const acao = novoStatus === 'aprovado' ? 'aprovado' : 
                 novoStatus === 'reprovado' ? 'reprovado' : 
                 novoStatus === 'correcao' ? 'correcao' : 'inspecionado'
    
    addEventoPonto(index, acao, `Status alterado para: ${novoStatus}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      pontos: formData.pontos || []
    } as Checklist)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Obra *</label>
          <input
            type="text"
            value={formData.obra}
            onChange={e => setFormData(prev => ({ ...prev, obra: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pontos de Inspeção</label>
        <div className="space-y-4">
          {(formData.pontos || []).map((ponto, idx) => (
            <div key={ponto.id} className="space-y-2">
              <div className="p-4 bg-gray-50 rounded-md">
                {/* Cabeçalho do ponto com status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ponto.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                      ponto.status === 'reprovado' ? 'bg-red-100 text-red-800' :
                      ponto.status === 'correcao' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ponto.status === 'aprovado' ? '✓ Aprovado' :
                       ponto.status === 'reprovado' ? '✗ Reprovado' :
                       ponto.status === 'correcao' ? '⚠ Correção' :
                       '⏳ Pendente'}
                    </span>
                    {ponto.data_inspecao && (
                      <span className="text-xs text-gray-500">
                        Inspecionado em: {new Date(ponto.data_inspecao).toLocaleDateString('pt-PT')}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePonto(idx)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Campos do ponto */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                  <input
                    type="text"
                    value={ponto.descricao}
                    onChange={e => updatePonto(idx, 'descricao', e.target.value)}
                    placeholder="Descrição do ponto"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={ponto.tipo}
                    onChange={e => updatePonto(idx, 'tipo', e.target.value)}
                    placeholder="Tipo"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={ponto.localizacao}
                    onChange={e => updatePonto(idx, 'localizacao', e.target.value)}
                    placeholder="Localização"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={ponto.responsavel}
                    onChange={e => updatePonto(idx, 'responsavel', e.target.value)}
                    placeholder="Responsável"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Botões de validação */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => updateStatusPonto(idx, 'aprovado')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      ponto.status === 'aprovado'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ✓ Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatusPonto(idx, 'reprovado')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      ponto.status === 'reprovado'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    ✗ Reprovado
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatusPonto(idx, 'correcao')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      ponto.status === 'correcao'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    ⚠ Correção
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatusPonto(idx, 'pendente')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      ponto.status === 'pendente'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ⏳ Pendente
                  </button>
                </div>
              </div>
              {/* Linha do tempo/histórico do ponto */}
              <div className="mt-2 bg-white border border-gray-200 rounded-md p-3">
                <div className="font-semibold text-xs text-gray-500 mb-1">Linha do tempo</div>
                <ul className="space-y-1 text-xs">
                  {(ponto.linha_tempo || []).length === 0 && (
                    <li className="text-gray-400">Sem eventos ainda</li>
                  )}
                  {(ponto.linha_tempo || []).map(ev => (
                    <li key={ev.id} className="flex items-center gap-2">
                      <span className="font-mono text-gray-400">{new Date(ev.data).toLocaleString('pt-PT')}</span>
                      <span className="font-semibold">{ev.acao}</span>
                      <span className="text-gray-600">{ev.detalhes}</span>
                      <span className="text-gray-400">{ev.responsavel}</span>
                    </li>
                  ))}
                </ul>
                {/* Simulação de adicionar evento */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Detalhes do evento"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded-md text-xs"
                    id={`evento-detalhes-${ponto.id}`}
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    onClick={() => {
                      const input = document.getElementById(`evento-detalhes-${ponto.id}`) as HTMLInputElement
                      if (input && input.value.trim()) {
                        addEventoPonto(idx, 'comentario', input.value)
                        input.value = ''
                      }
                    }}
                  >
                    + Evento
                  </button>
                </div>
              </div>

              {/* Anexos do ponto de inspeção */}
              <div className="mt-2 bg-white border border-gray-200 rounded-md p-3">
                <div className="font-semibold text-xs text-gray-500 mb-2">Anexos</div>
                
                {/* Lista de anexos existentes */}
                {(ponto.anexos || []).length > 0 && (
                  <div className="space-y-2 mb-3">
                    {(ponto.anexos || []).map(anexo => (
                      <div key={anexo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-gray-500" />
                          <div className="text-xs">
                            <div className="font-medium">{anexo.nome}</div>
                            <div className="text-gray-500">
                              {(anexo.tamanho / 1024).toFixed(1)} KB • {new Date(anexo.data_upload).toLocaleDateString('pt-PT')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => window.open(anexo.url, '_blank')}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Download"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAnexoPonto(idx, anexo.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Remover"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload de novos anexos */}
                <div className="border-2 border-dashed border-gray-300 rounded-md p-3">
                  <input
                    type="file"
                    id={`file-upload-${ponto.id}`}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      files.forEach(file => addAnexoPonto(idx, file))
                      e.target.value = '' // Reset input
                    }}
                  />
                  <label
                    htmlFor={`file-upload-${ponto.id}`}
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-md p-2"
                  >
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600">Clique para adicionar anexos</span>
                    <span className="text-xs text-gray-400">PDF, DOC, JPG, PNG, XLS (máx. 10MB)</span>
                  </label>
                </div>
              </div>

              {/* Comentários do ponto de inspeção */}
              <div className="mt-2 bg-white border border-gray-200 rounded-md p-3">
                <div className="font-semibold text-xs text-gray-500 mb-2">Comentários</div>
                
                {/* Lista de comentários existentes */}
                {(ponto.comentarios || []).length > 0 && (
                  <div className="space-y-2 mb-3">
                    {(ponto.comentarios || []).map(comentario => (
                      <div key={comentario.id} className="p-2 bg-blue-50 rounded-md">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-blue-800">{comentario.autor}</span>
                              <span className="text-xs text-gray-500">{new Date(comentario.data).toLocaleString('pt-PT')}</span>
                            </div>
                            <div className="text-xs text-gray-700">{comentario.texto}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeComentarioPonto(idx, comentario.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                            title="Remover comentário"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Adicionar novo comentário */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar comentário..."
                    className="flex-1 px-2 py-1 border border-gray-200 rounded-md text-xs"
                    id={`comentario-texto-${ponto.id}`}
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    onClick={() => {
                      const input = document.getElementById(`comentario-texto-${ponto.id}`) as HTMLInputElement
                      if (input && input.value.trim()) {
                        addComentarioPonto(idx, input.value)
                        input.value = ''
                      }
                    }}
                  >
                    + Comentário
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPonto}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ponto de Inspeção
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
        <textarea
          value={formData.observacoes}
          onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Guardar Checklist
        </button>
      </div>
    </form>
  )
} 