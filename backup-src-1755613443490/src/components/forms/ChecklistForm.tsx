import { useState, FormEvent, ChangeEvent } from "react";
import {
  Plus,
  X,
  Upload,
  File as FileIcon,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface PontoInspecao {
  id: string;
  descricao: string;
  tipo: string;
  localizacao: string;
  responsavel: string;
  status: "pendente" | "aprovado" | "reprovado" | "correcao";
  data_inspecao: string;
  observacoes: string;
  anexos: any[];
  comentarios: any[];
}

interface EventoPonto {
  id: string;
  data: string;
  acao: string;
  responsavel: string;
  detalhes: string;
}

interface ChecklistFormProps {
  initialData?: any;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export default function ChecklistForm({
  initialData,
  onCancel,
  onSubmit,
}: ChecklistFormProps) {
  const [formData, setFormData] = useState<any>({
    codigo: initialData?.codigo || "",
    obra_id: initialData?.obra_id || null,
    titulo: initialData?.titulo || "",
    status: initialData?.status || "em_andamento",
    responsavel: initialData?.responsavel || "",
    zona: initialData?.zona || "",
    estado: initialData?.estado || "pendente",
    observacoes: initialData?.observacoes || "",
    pontos: initialData?.pontos || [],
  });

  // Pontos de inspeção dinâmicos
  const addPonto = () => {
    setFormData((prev) => ({
      ...prev,
      pontos: [
        ...(prev.pontos || []),
        {
          id: Date.now().toString(),
          descricao: "",
          tipo: "",
          localizacao: "",
          responsavel: "",
          status: "pendente",
          data_inspecao: "",
          observacoes: "",
          anexos: [],
          comentarios: [],
        } as PontoInspecao,
      ],
    }));
  };

  const removePonto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).filter((_, i) => i !== index),
    }));
  };

  const updatePonto = (
    index: number,
    field: keyof PontoInspecao,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index ? { ...p, [field]: value } : p,
      ),
    }));
  };

  // Adicionar evento à linha do tempo de um ponto
  const addEventoPonto = (index: number, acao: string, detalhes: string) => {
    setFormData((prev) => ({
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
                  responsavel: p.responsavel || "",
                  detalhes,
                } as EventoPonto,
              ],
            }
          : p,
      ),
    }));
  };

  // Adicionar anexo a um ponto de inspeção
  const addAnexoPonto = (index: number, file: File) => {
    const anexo = {
      id: Date.now().toString(),
      nome: file.name,
      tipo: file.type,
      tamanho: file.size,
      data_upload: new Date().toISOString(),
      url: URL.createObjectURL(file),
    };

    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              anexos: [...(p.anexos || []), anexo],
            }
          : p,
      ),
    }));
  };

  // Remover anexo de um ponto de inspeção
  const removeAnexoPonto = (pontoIndex: number, anexoId: string) => {
    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === pontoIndex
          ? {
              ...p,
              anexos: (p.anexos || []).filter((a) => a.id !== anexoId),
            }
          : p,
      ),
    }));
  };

  // Adicionar comentário a um ponto de inspeção
  const addComentarioPonto = (index: number, texto: string) => {
    const comentario = {
      id: Date.now().toString(),
      autor: "Usuário Atual",
      data: new Date().toISOString(),
      texto,
      ponto_id: (formData.pontos || [])[index].id,
    };

    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              comentarios: [...(p.comentarios || []), comentario],
            }
          : p,
      ),
    }));
  };

  // Remover comentário de um ponto de inspeção
  const removeComentarioPonto = (pontoIndex: number, comentarioId: string) => {
    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === pontoIndex
          ? {
              ...p,
              comentarios: (p.comentarios || []).filter(
                (c) => c.id !== comentarioId,
              ),
            }
          : p,
      ),
    }));
  };

  // Atualizar status de um ponto de inspeção
  const updateStatusPonto = (
    index: number,
    novoStatus: PontoInspecao["status"],
  ) => {
    setFormData((prev) => ({
      ...prev,
      pontos: (prev.pontos || []).map((p, i) =>
        i === index
          ? {
              ...p,
              status: novoStatus,
              data_inspecao:
                novoStatus !== "pendente"
                  ? new Date().toISOString()
                  : p.data_inspecao,
            }
          : p,
      ),
    }));

    // Adicionar evento à linha do tempo
    const acao =
      novoStatus === "aprovado"
        ? "aprovado"
        : novoStatus === "reprovado"
          ? "reprovado"
          : novoStatus === "correcao"
            ? "correcao"
            : "inspecionado";

    addEventoPonto(index, acao, `Status alterado para: ${novoStatus}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Garantir que o campo codigo está preenchido
    let codigo = formData.codigo;
    if (!codigo) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      codigo = `CHK-${year}-${month}${day}-${random}`;
    }

    // Enviar dados completos incluindo pontos de inspeção
    const validData = {
      codigo,
      obra_id: formData.obra_id || null,
      titulo: formData.titulo,
      status: formData.status,
      responsavel: formData.responsavel,
      zona: formData.zona,
      estado: formData.estado || "pendente",
      observacoes: formData.observacoes,
      pontos: formData.pontos || [],
    };

    onSubmit(validData as any);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "reprovado":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "correcao":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800";
      case "reprovado":
        return "bg-red-100 text-red-800";
      case "correcao":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cabeçalho do Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Checklist
          </label>
          <input
            type="text"
            value={formData.codigo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, codigo: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Será gerado automaticamente se deixado vazio"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título do Checklist *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, titulo: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Inspeção de Fundações - Bloco A"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsável *
          </label>
          <input
            type="text"
            value={formData.responsavel}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, responsavel: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do responsável"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona/Área *
          </label>
          <input
            type="text"
            value={formData.zona}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, zona: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Fundações, Estrutura, Acabamentos"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Geral
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
          </select>
        </div>
      </div>

      {/* Pontos de Inspeção */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pontos de Inspeção
          </label>
          <button
            type="button"
            onClick={addPonto}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ponto
          </button>
        </div>

        <div className="space-y-4">
          {(formData.pontos || []).map((ponto, idx) => (
            <div
              key={ponto.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              {/* Cabeçalho do ponto */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    Ponto {idx + 1}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ponto.status)}`}
                  >
                    {getStatusIcon(ponto.status)}
                    {ponto.status === "aprovado"
                      ? "Aprovado"
                      : ponto.status === "reprovado"
                        ? "Reprovado"
                        : ponto.status === "correcao"
                          ? "Correção"
                          : "Pendente"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removePonto(idx)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Campos do ponto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    value={ponto.descricao}
                    onChange={(e) =>
                      updatePonto(idx, "descricao", e.target.value)
                    }
                    placeholder="Ex: Verificação da armadura das fundações"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <input
                    type="text"
                    value={ponto.tipo}
                    onChange={(e) => updatePonto(idx, "tipo", e.target.value)}
                    placeholder="Ex: Estrutural, Acabamento, Instalação"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={ponto.localizacao}
                    onChange={(e) =>
                      updatePonto(idx, "localizacao", e.target.value)
                    }
                    placeholder="Ex: Pilar P1, Parede Norte, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={ponto.responsavel}
                    onChange={(e) =>
                      updatePonto(idx, "responsavel", e.target.value)
                    }
                    placeholder="Nome do responsável pela inspeção"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Observações do ponto */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={ponto.observacoes}
                  onChange={(e) =>
                    updatePonto(idx, "observacoes", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Observações específicas deste ponto..."
                />
              </div>

              {/* Botões de validação */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => updateStatusPonto(idx, "aprovado")}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    ponto.status === "aprovado"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <CheckCircle className="h-3 w-3" />
                  Aprovar
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusPonto(idx, "reprovado")}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    ponto.status === "reprovado"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  <AlertCircle className="h-3 w-3" />
                  Reprovado
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusPonto(idx, "correcao")}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    ponto.status === "correcao"
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  <AlertCircle className="h-3 w-3" />
                  Correção
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusPonto(idx, "pendente")}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    ponto.status === "pendente"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  Pendente
                </button>
              </div>

              {/* Anexos */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Anexos
                  </label>
                  <input
                    type="file"
                    id={`file-upload-${ponto.id}`}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => addAnexoPonto(idx, file));
                      e.target.value = "";
                    }}
                  />
                  <label
                    htmlFor={`file-upload-${ponto.id}`}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer hover:bg-blue-600"
                  >
                    <Upload className="h-3 w-3 inline mr-1" />
                    Adicionar
                  </label>
                </div>

                {(ponto.anexos || []).length > 0 && (
                  <div className="space-y-1">
                    {(ponto.anexos || []).map((anexo) => (
                      <div
                        key={anexo.id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex items-center gap-2">
                          <File className="h-3 w-3 text-gray-500" />
                          <span className="text-xs">{anexo.nome}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAnexoPonto(idx, anexo.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comentários */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Comentários
                  </label>
                </div>

                {(ponto.comentarios || []).length > 0 && (
                  <div className="space-y-2 mb-2">
                    {(ponto.comentarios || []).map((comentario) => (
                      <div
                        key={comentario.id}
                        className="p-2 bg-blue-50 rounded border"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-blue-800">
                                {comentario.autor}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comentario.data).toLocaleString(
                                  "pt-PT",
                                )}
                              </span>
                            </div>
                            <div className="text-xs text-gray-700">
                              {comentario.texto}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeComentarioPonto(idx, comentario.id)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
                      const input = document.getElementById(
                        `comentario-texto-${ponto.id}`,
                      ) as HTMLInputElement;
                      if (input && input.value.trim()) {
                        addComentarioPonto(idx, input.value);
                        input.value = "";
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observações Gerais */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações Gerais
        </label>
        <textarea
          value={formData.observacoes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, observacoes: e.target.value }))
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Observações gerais sobre o checklist..."
        />
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Salvar Checklist
        </button>
      </div>
    </form>
  );
}
